import { useState, useEffect, useRef } from 'react';
import MQTT from 'mqtt';
import instance from '../api/axios';

export const useMqtt = (macAddress) => {
    const [datos, setDatos] = useState({ 
        bombaAgua: false, 
        ultimaComida: null,
        estadoConexion: 'desconectado'
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

    // Función para publicar comandos
    const publicarComando = (tipo, accion) => {
        return new Promise((resolve, reject) => {
            if (!clientRef.current?.connected) {
                reject(new Error('Cliente MQTT no conectado'));
                return;
            }

            const topic = `mascota/${tipo}/${macAddress}`;
            
            clientRef.current.publish(topic, accion, { qos: 1 }, (err) => {
                if (err) {
                    console.error(`Error al publicar en ${topic}:`, err);
                    reject(err);
                } else {
                    console.log(`Comando ${accion} publicado en ${topic}`);
                    resolve();
                }
            });
        });
    };

    // Funciones específicas
    const dispensarComida = () => publicarComando('comida', 'dispensar');
    const controlarBombaAgua = (activar) => publicarComando('agua', activar ? 'activar' : 'desactivar');

    useEffect(() => {
        if (!macAddress) {
            console.error("MAC Address no proporcionada");
            setLoading(false);
            return;
        }

        const mqttOptions = {
            clientId: `pet-feeder-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
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
            console.log("Conectado al broker MQTT para alimentador de mascotas");
            
            const topicEstado = `mascota/estado/${macAddress}`;
            const topicConfirmacion = `mascota/confirmacion/${macAddress}`;
            
            clientRef.current.subscribe(topicEstado, { qos: 1 }, (err) => {
                if (!err) {
                    console.log(`Suscrito a: ${topicEstado}`);
                    setConectado(true);
                    setDatos(prev => ({ ...prev, estadoConexion: 'conectado' }));
                } else {
                    console.error("Error al suscribirse a estado:", err);
                    setConectado(false);
                }
            });

            clientRef.current.subscribe(topicConfirmacion, { qos: 1 }, (err) => {
                if (!err) {
                    console.log(`Suscrito a: ${topicConfirmacion}`);
                } else {
                    console.error("Error al suscribirse a confirmación:", err);
                }
            });
        });

        clientRef.current.on('message', (topic, message) => {
            const msgStr = message.toString();
            console.log(`Mensaje recibido [${topic}]: ${msgStr}`);
            
            if (topic === `mascota/estado/${macAddress}`) {
                try {
                    const data = JSON.parse(msgStr);
                    setDatos(prev => ({
                        ...prev,
                        bombaAgua: data.bombaAgua,
                        ultimaComida: data.ultimaComida
                    }));
                    
                    // Guardar estado en base de datos
                    guardarEstadoEnBD(data);
                    
                    lastMessageTimeRef.current = Date.now();
                    setConectado(true);
                } catch (err) {
                    console.error('Error al parsear mensaje:', err);
                }
            }
        });

        const intervalo = setInterval(() => {
            if (lastMessageTimeRef.current && Date.now() - lastMessageTimeRef.current > 15000) {
                console.log("No se han recibido mensajes en el tiempo esperado");
                setConectado(false);
                setDatos(prev => ({ ...prev, estadoConexion: 'desconectado' }));
            }
        }, 5000);

        clientRef.current.on('error', (err) => {
            console.error("Error en conexión MQTT:", err);
            setConectado(false);
            setDatos(prev => ({ ...prev, estadoConexion: 'error' }));
            
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
        dispensarComida, 
        controlarBombaAgua 
    };
};

