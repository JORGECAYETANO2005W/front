import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import instance from "../../api/axios";
import "../../styles/PetFeeder.css";
import MQTT from "mqtt";

const PetFeederDashboard = () => {
  const { macAddress } = useParams();
  const [datosSensores, setDatosSensores] = useState({
    bombaAgua: false,
    ultimaComida: 0,
    dispensandoComida: false,
    cantidadComidaRecipiente: 0,
    cantidadAguaRecipiente: 0,
    platoComidaLleno: false,
    platoAguaLleno: false,
    timestamp: 0
  });
  const [ultimoEstado, setUltimoEstado] = useState(null);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [lastCommands, setLastCommands] = useState({
    comida: null,
    agua: null
  });
  const client = useRef(null);

  // Función para obtener los datos del dispensador
  const obtenerDatosDispensador = async () => {
    try {
      const response = await instance.get(
        `/estado-dispositivo/${macAddress}/ultimo`
      );
      setUltimoEstado(response.data);
      setDatosSensores({
        bombaAgua: response.data.bombaAgua || false,
        ultimaComida: response.data.ultimaComida || 0,
        dispensandoComida: response.data.dispensandoComida || false,
        cantidadComidaRecipiente: response.data.cantidadComidaRecipiente || 0,
        cantidadAguaRecipiente: response.data.cantidadAguaRecipiente || 0,
        platoComidaLleno: response.data.platoComidaLleno || false,
        platoAguaLleno: response.data.platoAguaLleno || false,
        timestamp: response.data.timestamp || 0
      });
    } catch (error) {
      console.error("Error al obtener los datos del dispensador:", error);
    }
  };

  // Usar un intervalo para obtener los datos cada 5 segundos
  useEffect(() => {
    if (!macAddress) return;

    obtenerDatosDispensador(); // Inicializa la obtención de datos al montar el componente

    const intervalId = setInterval(() => {
      obtenerDatosDispensador(); // Actualiza los datos cada 5 segundos
    }, 5000);

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [macAddress]);

  // Configuración de MQTT
  useEffect(() => {
    if (!macAddress) return;

    const mqttOptions = {
      clientId: `pet-feeder-dashboard-${macAddress}-${Math.random()
        .toString(16)
        .substring(2, 8)}`,
      username: "esp32",
      password: "esp32",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,
      protocol: 'wss'
    };

    const url = "wss://raba7554.ala.dedicated.aws.emqxcloud.com:8084/mqtt";
    client.current = MQTT.connect(url, mqttOptions);

    client.current.on("connect", () => {
      console.log("✅ Conexión MQTT establecida correctamente");
      setMqttConnected(true);

      const topics = [
        `mascota/estado/${macAddress}`,
        `mascota/confirmacion/${macAddress}`
      ];

      topics.forEach((topic) => {
        client.current.subscribe(topic, (err) => {
          if (!err) {
            console.log(`✅ Suscrito al tema: ${topic}`);
          } else {
            console.error("❌ Error al suscribirse:", err);
          }
        });
      });
    });

    client.current.on("error", (err) => {
      console.error("❌ Error en la conexión MQTT:", err);
      setMqttConnected(false);
    });

    client.current.on("message", (topic, message) => {
      const messageStr = message.toString();
      console.log(
        `📨 Mensaje recibido en tema ${topic}: ${messageStr}`
      );

      if (topic === `mascota/estado/${macAddress}`) {
        try {
          const payload = JSON.parse(messageStr);
          console.log("Estado del dispensador recibido:", payload);

          setDatosSensores({
            bombaAgua: payload.bombaAgua || false,
            ultimaComida: payload.ultimaComida || 0,
            dispensandoComida: payload.dispensandoComida || false,
            cantidadComidaRecipiente: payload.cantidadComidaRecipiente || 0,
            cantidadAguaRecipiente: payload.cantidadAguaRecipiente || 0,
            platoComidaLleno: payload.platoComidaLleno || false,
            platoAguaLleno: payload.platoAguaLleno || false,
            timestamp: payload.timestamp || 0
          });
        } catch (error) {
          console.error("Error al procesar mensaje de estado:", error);
        }
      } else if (topic === `mascota/confirmacion/${macAddress}`) {
        // Procesar confirmaciones
        if (messageStr.includes("comida:")) {
          setLastCommands((prev) => ({ ...prev, comida: messageStr }));
          obtenerDatosDispensador();
        } else if (messageStr.includes("agua:")) {
          setLastCommands((prev) => ({ ...prev, agua: messageStr }));
          obtenerDatosDispensador();
        }
      }
    });

    client.current.on("offline", () => {
      console.log("❌ Cliente MQTT desconectado");
      setMqttConnected(false);
    });

    client.current.on("reconnect", () => {
      console.log("🔄 Intentando reconectar a MQTT...");
    });

    return () => {
      if (client.current) {
        console.log("🛑 Desconectando cliente MQTT");
        client.current.end();
      }
    };
  }, [macAddress]);

  // Función para registrar acción en el historial
  const registrarAccion = async (tipoAccion, estadoAnterior, estadoNuevo) => {
    try {
      await instance.post("/historial-acciones", {
        macAddress,
        accion: tipoAccion,
        estadoAnterior,
        estadoNuevo,
      });
      console.log(`✅ Acción ${tipoAccion} registrada en el historial`);

      // Actualizar datos después de registrar una acción
      obtenerDatosDispensador();
    } catch (error) {
      console.error("❌ Error al registrar la acción:", error);
    }
  };

  // Función para publicar mensajes MQTT
  const publicarMensaje = async (tipo, comando) => {
    if (!client.current || !mqttConnected) {
      console.error("❌ Cliente MQTT no conectado");
      return;
    }

    let topic;
    const comandoStr = String(comando);
    
    // Obtener el estado actual del actuador
    let estadoAnterior;
    let tipoAccion;

    switch (tipo) {
      case "comida":
        estadoAnterior = datosSensores.dispensandoComida ? "Dispensando" : "Inactivo";
        tipoAccion = "dispensar_comida";
        topic = `mascota/comida/${macAddress}`;
        break;
      case "agua":
        estadoAnterior = datosSensores.bombaAgua ? "Activada" : "Desactivada";
        tipoAccion = "control_agua";
        topic = `mascota/agua/${macAddress}`;
        break;
      default:
        console.error("Tipo de comando no válido");
        return;
    }

    client.current.publish(
      topic,
      comandoStr,
      { qos: 1, retain: false },
      async (error) => {
        if (error) {
          console.error(`❌ Error al publicar en ${topic}:`, error);
        } else {
          console.log(`✅ Mensaje enviado a ${topic}: ${comandoStr}`);
          await registrarAccion(tipoAccion, estadoAnterior, comandoStr);
          // Actualizar datos después de enviar el comando
          obtenerDatosDispensador();
        }
      }
    );
  };

  // Formatear tiempo transcurrido
  const formatearTiempoUltimaComida = (ms) => {
    if (!ms) return "No disponible";
    
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    
    if (horas > 0) {
      return `${horas}h ${minutos % 60}m`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos % 60}s`;
    } else {
      return `${segundos}s`;
    }
  };

  // Calcular porcentaje de comida/agua
  const calcularPorcentajeNivel = (nivel) => {
    return Math.min(100, Math.max(0, nivel));
  };

  if (!macAddress) {
    return (
      <p className="PetFeeder-error-message">Error: MAC Address no encontrado</p>
    );
  }

  return (
    <div className="PetFeeder-dashboard-container">
      <div className="PetFeeder-dashboard-header">
        <h2 className="PetFeeder-dashboard-title">Panel de Control - Alimentador de Mascotas</h2>

        <div className="PetFeeder-connection-widget">
          <div className="PetFeeder-connection-card">
            <h3 className="PetFeeder-card-header">Estado de Conexión</h3>
            <div className="PetFeeder-connection-body">
              <div className="PetFeeder-connection-status-item">
                <span className="PetFeeder-connection-label">
                  Estado del dispositivo:
                </span>
                <div className="PetFeeder-status-indicator-container">
                  <div
                    className={`PetFeeder-status-indicator ${
                      mqttConnected ? "PetFeeder-connected" : "PetFeeder-disconnected"
                    }`}
                  ></div>
                  <span className="PetFeeder-connection-text">
                    {mqttConnected ? "Conectado" : "Desconectado"}
                  </span>
                </div>
              </div>
              <div className="PetFeeder-connection-status-item">
                <span className="PetFeeder-connection-label">MAC Address:</span>
                <span className="PetFeeder-mac-address">{macAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para ir al historial de acciones */}
      <div className="PetFeeder-history-button-container">
        <Link
          to={`/historialAcciones/${macAddress}`}
          className="PetFeeder-button PetFeeder-button-secondary"
        >
          <div className="PetFeeder-button-icon">
            <div className="PetFeeder-icon-history">
              <div className="PetFeeder-history-arrow"></div>
              <div className="PetFeeder-history-circle"></div>
            </div>
          </div>
          <span className="PetFeeder-button-text">Ver Historial de Alimentación</span>
        </Link>
      </div>

      <div className="PetFeeder-dashboard-grid">
        {/* Tarjeta de Nivel de Comida */}
        <div className="PetFeeder-metric-card">
          <div className="PetFeeder-card-content">
            <div className="PetFeeder-card-header">
              <div className="PetFeeder-card-title">
                <div className="PetFeeder-icon-food">
                  <div className="PetFeeder-food-bowl"></div>
                  <div className="PetFeeder-food-kibble"></div>
                </div>
                <h3>Nivel de Comida</h3>
              </div>
            </div>
            <div className="PetFeeder-card-body">
              <div className="PetFeeder-metric-value">
                {datosSensores.cantidadComidaRecipiente}
                <span className="PetFeeder-unit">%</span>
              </div>
              <div className="PetFeeder-progress-container">
                <div
                  className="PetFeeder-progress-bar"
                  style={{
                    width: `${calcularPorcentajeNivel(datosSensores.cantidadComidaRecipiente)}%`,
                  }}
                ></div>
              </div>
              <div className="PetFeeder-metric-status">
                <span className="PetFeeder-status-text">
                  Última comida hace: {formatearTiempoUltimaComida(datosSensores.ultimaComida)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Nivel de Agua */}
        <div className="PetFeeder-metric-card">
          <div className="PetFeeder-card-content">
            <div className="PetFeeder-card-header">
              <div className="PetFeeder-card-title">
                <div className="PetFeeder-icon-water">
                  <div className="PetFeeder-water-container"></div>
                  <div 
                    className="PetFeeder-water-level"
                    style={{
                      height: `${calcularPorcentajeNivel(datosSensores.cantidadAguaRecipiente)}%`,
                    }}
                  ></div>
                </div>
                <h3>Nivel de Agua</h3>
              </div>
            </div>
            <div className="PetFeeder-card-body">
              <div className="PetFeeder-metric-value">
                {datosSensores.cantidadAguaRecipiente}
                <span className="PetFeeder-unit">%</span>
              </div>
              <div className="PetFeeder-progress-container">
                <div
                  className="PetFeeder-progress-bar"
                  style={{
                    width: `${calcularPorcentajeNivel(datosSensores.cantidadAguaRecipiente)}%`,
                  }}
                ></div>
              </div>
              <div className="PetFeeder-metric-status">
                <span className="PetFeeder-status-text">
                  Bomba de agua: {datosSensores.bombaAgua ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Control de Dispensador de Comida */}
        <div className="PetFeeder-control-card">
          <div className="PetFeeder-card-content">
            <div className="PetFeeder-card-header">
              <div className="PetFeeder-card-title">
                <div className="PetFeeder-icon-dispenser">
                  <div className="PetFeeder-dispenser-body"></div>
                  <div className="PetFeeder-dispenser-output"></div>
                  <div className="PetFeeder-dispenser-kibble"></div>
                </div>
                <h3>Dispensador de Comida</h3>
              </div>
            </div>
            <div className="PetFeeder-card-body">
              <div className="PetFeeder-control-status">
                Estado: <strong>{datosSensores.dispensandoComida ? "Dispensando" : "Listo"}</strong>
              </div>
              <div className="PetFeeder-control-buttons">
                <button
                  className="PetFeeder-button PetFeeder-button-primary"
                  onClick={() => publicarMensaje("comida", "dispensar")}
                  disabled={!mqttConnected || datosSensores.dispensandoComida}
                >
                  <span className="PetFeeder-button-text">Dispensar Comida</span>
                </button>
              </div>
              <div className="PetFeeder-command-info">
                Estado del plato: <span className="PetFeeder-command-value">
                  {datosSensores.platoComidaLleno ? "Lleno" : "Disponible"}
                </span>
              </div>
              <div className="PetFeeder-command-info">
                Último comando: <span className="PetFeeder-command-value">
                  {lastCommands.comida || "Ninguno"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Control de Bomba de Agua */}
        <div className="PetFeeder-control-card">
          <div className="PetFeeder-card-content">
            <div className="PetFeeder-card-header">
              <div className="PetFeeder-card-title">
                <div className="PetFeeder-icon-pump">
                  <div className="PetFeeder-pump-body"></div>
                  <div className="PetFeeder-pump-motor"></div>
                  <div className="PetFeeder-water-drop"></div>
                </div>
                <h3>Bomba de Agua</h3>
              </div>
            </div>
            <div className="PetFeeder-card-body">
              <div className="PetFeeder-control-status">
                Estado: <strong>{datosSensores.bombaAgua ? "Activa" : "Inactiva"}</strong>
              </div>
              <div className="PetFeeder-control-buttons">
                <button
                  className="PetFeeder-button PetFeeder-button-primary"
                  onClick={() => publicarMensaje("agua", "activar")}
                  disabled={!mqttConnected || datosSensores.bombaAgua}
                >
                  <span className="PetFeeder-button-text">Activar Bomba</span>
                </button>
                <button
                  className="PetFeeder-button PetFeeder-button-danger"
                  onClick={() => publicarMensaje("agua", "desactivar")}
                  disabled={!mqttConnected || !datosSensores.bombaAgua}
                >
                  <span className="PetFeeder-button-text">Desactivar Bomba</span>
                </button>
              </div>
              <div className="PetFeeder-command-info">
                Estado del plato: <span className="PetFeeder-command-value">
                  {datosSensores.platoAguaLleno ? "Lleno" : "Disponible"}
                </span>
              </div>
              <div className="PetFeeder-command-info">
                Último comando: <span className="PetFeeder-command-value">
                  {lastCommands.agua || "Ninguno"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetFeederDashboard;