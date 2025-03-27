import { useState, useEffect, useRef } from 'react';
import MQTT from 'mqtt';

export const useMqtt = (macAddress) => {
    const [datos, setDatos] = useState({ 
        bombaAgua: false, 
        ultimaComida: undefined 
    });
    const [conectado, setConectado] = useState(false);
    const [loading, setLoading] = useState(true);
    const clientRef = useRef(null);
    const lastMessageTimeRef = useRef(null);

    // Función para controlar dispensador de comida
    const dispensarComida = () => {
        if (!clientRef.current || !conectado || !macAddress) {
            console.error("No se puede dispensar comida: cliente desconectado");
            return false;
        }
        
        const topic = `mascota/comida/${macAddress}`;
        clientRef.current.publish(topic, "dispensar");
        console.log("Comando para dispensar comida enviado");
        return true;
    };

    // Función para controlar bomba de agua
   // En tu archivo useMqtt.js
const controlarBombaAgua = (activar) => {
    if (!clientRef.current || !conectado || !macAddress) {
        console.error("Cliente MQTT no disponible");
        return false;
    }
    
    const topic = `mascota/agua/${macAddress}`;
    const mensaje = activar ? "activar" : "desactivar";
    
    console.log(`Enviando comando a ${topic}: ${mensaje}`);
    
    clientRef.current.publish(topic, mensaje, { qos: 1 }, (err) => {
        if (err) {
            console.error("Error al publicar:", err);
        } else {
            console.log("Comando enviado con éxito (QoS 1)");
        }
    });
    
    return true;
};
    useEffect(() => {
        if (!macAddress) {
            console.error("MAC Address no proporcionada");
            setLoading(false);
            return;
        }

        // Configuración de cliente MQTT
        const mqttOptions = {
            clientId: `pet-feeder-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
            username: "esp32",
            password: "esp32",
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            protocol: 'wss', // Fuerza el protocolo seguro
            rejectUnauthorized: false, // Solo para desarrollo (no usar en producción)
            wsOptions: {
              // Opciones adicionales para WebSocket seguro
            }
          };

        // Para navegadores, usar WebSocket en lugar de TCP
        const brokerUrl = "wss://raba7554.ala.dedicated.aws.emqxcloud.com:8084/mqtt";
        clientRef.current = MQTT.connect(brokerUrl, mqttOptions);

        clientRef.current.on('connect', () => {
            console.log("Conectado al broker MQTT para alimentador de mascotas");
            
            // Suscribirse al tema de estado del dispositivo
            const estadoTopic = `mascota/estado/${macAddress}`;
            clientRef.current.subscribe(estadoTopic, (err) => {
                if (!err) {
                    console.log(`Suscrito a: ${estadoTopic}`);
                    setConectado(true);
                } else {
                    console.error("Error al suscribirse:", err);
                    setConectado(false);
                }
            });
        });

        clientRef.current.on('message', (topic, message) => {
            if (topic === `mascota/estado/${macAddress}`) {
                try {
                    const payload = JSON.parse(message.toString());
                    console.log("Datos del alimentador recibidos:", payload);
                    
                    // Actualizar datos
                    setDatos({
                        bombaAgua: payload.bombaAgua,
                        ultimaComida: payload.ultimaComida
                    });
                    
                    // Actualizar tiempo del último mensaje
                    lastMessageTimeRef.current = Date.now();
                    setConectado(true);
                } catch (error) {
                    console.error("Error al procesar mensaje:", error);
                }
            }
        });

        // Verificar desconexión por timeout
        const intervalo = setInterval(() => {
            if (lastMessageTimeRef.current && Date.now() - lastMessageTimeRef.current > 15000) {
                console.log("No se han recibido mensajes en el tiempo esperado");
                setConectado(false);
            }
        }, 5000);

        clientRef.current.on('error', (err) => {
            console.error("Error en conexión MQTT:", err);
            setConectado(false);
        });

        setLoading(false);

        // Limpieza
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