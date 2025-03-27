import { useState, useEffect, useRef } from 'react';
import MQTT from 'mqtt';

export const useMqtt = (macAddress) => {
    const [datos, setDatos] = useState({ 
        bombaAgua: false, 
        ultimaComida: null,
        estadoConexion: 'desconectado'
    });
    const [loading, setLoading] = useState(true);
    const clientRef = useRef(null);
    const lastMessageRef = useRef(null);

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
            console.error('MAC Address no proporcionada');
            setLoading(false);
            return;
        }

        // Configuración de conexión MQTT
        const options = {
            clientId: `web-${macAddress}-${Math.random().toString(16).substr(2, 8)}`,
            username: 'esp32',
            password: 'esp32',
            clean: true,
            reconnectPeriod: 5000,
            connectTimeout: 8000,
            protocol: 'wss',
            rejectUnauthorized: false
        };

        const brokerUrl = 'wss://raba7554.ala.dedicated.aws.emqxcloud.com/mqtt';
        clientRef.current = MQTT.connect(brokerUrl, options);

        // Manejadores de eventos
        clientRef.current.on('connect', () => {
            console.log('Conectado al broker MQTT');
            setDatos(prev => ({ ...prev, estadoConexion: 'conectado' }));
            setLoading(false);

            // Suscripciones
            const topicEstado = `mascota/estado/${macAddress}`;
            const topicConfirmacion = `mascota/confirmacion/${macAddress}`;
            
            clientRef.current.subscribe(topicEstado, { qos: 1 }, (err) => {
                if (err) {
                    console.error(`Error al suscribirse a ${topicEstado}:`, err);
                } else {
                    console.log(`Suscrito a ${topicEstado} con QoS 1`);
                }
            });

            clientRef.current.subscribe(topicConfirmacion, { qos: 1 }, (err) => {
                if (err) {
                    console.error(`Error al suscribirse a ${topicConfirmacion}:`, err);
                } else {
                    console.log(`Suscrito a ${topicConfirmacion} con QoS 1`);
                }
            });
        });

        clientRef.current.on('message', (topic, message) => {
            const msgStr = message.toString();
            lastMessageRef.current = Date.now();
            
            console.log(`Mensaje recibido [${topic}]: ${msgStr}`);
            
            if (topic === `mascota/estado/${macAddress}`) {
                try {
                    const data = JSON.parse(msgStr);
                    setDatos(prev => ({
                        ...prev,
                        bombaAgua: data.bombaAgua,
                        ultimaComida: data.ultimaComida
                    }));
                } catch (err) {
                    console.error('Error al parsear mensaje:', err);
                }
            }
        });

        clientRef.current.on('error', (err) => {
            console.error('Error en conexión MQTT:', err);
            setDatos(prev => ({ ...prev, estadoConexion: 'error' }));
        });

        clientRef.current.on('close', () => {
            console.log('Conexión MQTT cerrada');
            setDatos(prev => ({ ...prev, estadoConexion: 'desconectado' }));
        });

        // Verificar actividad periódicamente
        const checkActivity = setInterval(() => {
            if (lastMessageRef.current && Date.now() - lastMessageRef.current > 30000) {
                console.log('Sin actividad MQTT en los últimos 30 segundos');
                setDatos(prev => ({ ...prev, estadoConexion: 'inactivo' }));
            }
        }, 10000);

        // Limpieza
        return () => {
            clearInterval(checkActivity);
            if (clientRef.current) {
                clientRef.current.end();
                console.log('Desconectado de MQTT');
            }
        };
    }, [macAddress]);

    return { 
        datos, 
        loading, 
        conectado: datos.estadoConexion === 'conectado',
        dispensarComida, 
        controlarBombaAgua 
    };
};