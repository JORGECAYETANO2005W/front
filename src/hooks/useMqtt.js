import { useState, useEffect, useRef } from 'react';
import MQTT from 'mqtt';
import instance from '../api/axios';

export const useMqtt = (macAddress) => {
    const [datos, setDatos] = useState({
        bombaAgua: false,
        ultimaComida: 0,
        dispensandoComida: false,
        cantidadComidaRecipiente: 0,
        cantidadAguaRecipiente: 0,
        platoComidaLleno: false,
        platoAguaLleno: false
    });
    const [conectado, setConectado] = useState(false);
    const [loading, setLoading] = useState(true);
    const clientRef = useRef(null);
    const lastMessageTimeRef = useRef(null);

    const guardarEstadoEnBD = async (payload) => {
        try {
            const response = await instance.post('/estado-dispositivo', {
                macAddress,
                ...payload
            });
            console.log("Estado guardado en la base de datos:", response.data);
        } catch (error) {
            console.error("Error al guardar el estado en la base de datos:", error);
        }
    };

    const enviarComando = (comando) => {
        if (!clientRef.current || !conectado) {
            console.error("No hay conexión MQTT activa");
            return false;
        }

        try {
            // Comandos compatibles con el dispensador
            if (comando === 'dispensarComida') {
                clientRef.current.publish(`mascota/comida/${macAddress}`, "dispensar");
                return true;
            } else if (comando === 'activarAgua') {
                clientRef.current.publish(`mascota/agua/${macAddress}`, "activar");
                return true;
            } else if (comando === 'desactivarAgua') {
                clientRef.current.publish(`mascota/agua/${macAddress}`, "desactivar");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al enviar comando:", error);
            return false;
        }
    };

    useEffect(() => {
        if (!macAddress) {
            console.error("MAC Address no proporcionada");
            setLoading(false);
            return;
        }

        const mqttOptions = {
            clientId: `pet-feeder-client-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
            username: "esp32",
            password: "esp32",
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            rejectUnauthorized: false,
            protocol: 'wss',
            wsOptions: {}
        };

        const brokerUrl = "wss://raba7554.ala.dedicated.aws.emqxcloud.com:8084/mqtt";
        clientRef.current = MQTT.connect(brokerUrl, mqttOptions);

        clientRef.current.on('connect', () => {
            console.log("Conectado al broker MQTT");
            
            // Suscripción al tópico de estado del dispensador
            const estadoTopic = `mascota/estado/${macAddress}`;
            // Suscripción al tópico de confirmación
            const confirmacionTopic = `mascota/confirmacion/${macAddress}`;
            
            clientRef.current.subscribe([estadoTopic, confirmacionTopic], (err) => {
                if (!err) {
                    console.log(`Suscrito a: ${estadoTopic} y ${confirmacionTopic}`);
                    setConectado(true);
                } else {
                    console.error("Error al suscribirse:", err);
                    setConectado(false);
                }
            });
        });

        clientRef.current.on('message', (topic, message) => {
            const messageStr = message.toString();
            console.log(`Mensaje recibido en ${topic}: ${messageStr}`);
            
            if (topic === `mascota/estado/${macAddress}`) {
                try {
                    const payload = JSON.parse(messageStr);
                    console.log("Estado del dispensador recibido:", payload);

                    setDatos({
                        bombaAgua: payload.bombaAgua,
                        ultimaComida: payload.ultimaComida,
                        dispensandoComida: payload.dispensandoComida || false,
                        cantidadComidaRecipiente: payload.cantidadComidaRecipiente || 0,
                        cantidadAguaRecipiente: payload.cantidadAguaRecipiente || 0,
                        platoComidaLleno: payload.platoComidaLleno || false,
                        platoAguaLleno: payload.platoAguaLleno || false,
                        timestamp: payload.timestamp
                    });

                    guardarEstadoEnBD(payload);
                    lastMessageTimeRef.current = Date.now();
                    setConectado(true);
                } catch (error) {
                    console.error("Error al procesar mensaje de estado:", error);
                }
            } else if (topic === `mascota/confirmacion/${macAddress}`) {
                // Procesar confirmaciones (ej: "comida:dispensando", "agua:activada")
                console.log("Confirmación recibida:", messageStr);
                // Aquí puedes actualizar estados específicos basados en confirmaciones
                if (messageStr === "comida:dispensando") {
                    setDatos(prev => ({ ...prev, dispensandoComida: true }));
                } else if (messageStr === "comida:completado") {
                    setDatos(prev => ({ ...prev, dispensandoComida: false }));
                } else if (messageStr === "agua:activada") {
                    setDatos(prev => ({ ...prev, bombaAgua: true }));
                } else if (messageStr === "agua:desactivada") {
                    setDatos(prev => ({ ...prev, bombaAgua: false }));
                }
            }
        });

        const intervalo = setInterval(() => {
            if (lastMessageTimeRef.current && Date.now() - lastMessageTimeRef.current > 15000) {
                console.log("No se han recibido mensajes en el tiempo esperado");
                setConectado(false);
            }
        }, 5000);

        clientRef.current.on('error', (err) => {
            console.error("Error en conexión MQTT:", err);
            setConectado(false);
            
            setTimeout(() => {
                if (clientRef.current) {
                    clientRef.current.end();
                }
                console.log("Intentando reconexión...");
                clientRef.current = MQTT.connect(brokerUrl, mqttOptions);
            }, 5000);
        });

        setLoading(false);

        return () => {
            clearInterval(intervalo);
            if (clientRef.current) {
                clientRef.current.end();
                console.log("Cliente MQTT desconectado");
            }
        };
    }, [macAddress]);

    return { 
        datos, 
        conectado, 
        loading,
        dispensarComida: () => enviarComando('dispensarComida'),
        activarAgua: () => enviarComando('activarAgua'),
        desactivarAgua: () => enviarComando('desactivarAgua')
    };
};

