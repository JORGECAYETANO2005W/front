import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useMqtt } from '../../hooks/useMqtt';
import '../../styles/IoT.css';

const UserDashboard = () => {
  const { id } = useParams();
  const macAddress = id || "";
  
  // Estados del dispositivo
  const { 
    datos, 
    conectado, 
    loading, 
    dispensarComida, 
    controlarBombaAgua 
  } = useMqtt(macAddress);
  
  // Estados de la interfaz
  const [nivelComida, setNivelComida] = useState(80); // 0-100%
  const [nivelAgua, setNivelAgua] = useState(60);    // 0-100%
  const [platoComida, setPlatoComida] = useState(30); // 0-100%
  const [platoAgua, setPlatoAgua] = useState(20);    // 0-100%
  const [isDispensando, setIsDispensando] = useState(false);
  const [isBombaActiva, setIsBombaActiva] = useState(false);
  const [logs, setLogs] = useState([]);

  // Efecto para sincronizar estados con los datos MQTT
  useEffect(() => {
    if (!loading && datos) {
      setIsBombaActiva(datos.bombaAgua || false);
      
      // Actualizar log de actividad
      addLog(`Estado actualizado - Bomba: ${datos.bombaAgua ? 'ON' : 'OFF'}`);
    }
  }, [datos, loading]);

  // Función para agregar mensajes al log
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Control de dispensación de comida
  const handleDispensarComida = async () => {
    if (nivelComida <= 0) {
      addLog("Error: Recipiente de comida vacío");
      return;
    }
    
    setIsDispensando(true);
    addLog("Iniciando dispensado de comida...");
    
    try {
      await dispensarComida();
      addLog("Comando de dispensar enviado");
      
      // Simular reducción de comida
      setTimeout(() => {
        setNivelComida(prev => Math.max(0, prev - 15));
        setPlatoComida(prev => Math.min(100, prev + 40));
        setIsDispensando(false);
        addLog("Comida dispensada correctamente");
      }, 2000);
    } catch (error) {
      setIsDispensando(false);
      addLog("Error al dispensar comida");
      console.error(error);
    }
  };

  // Control de bomba de agua
  const handleBombaAgua = async () => {
    if (nivelAgua <= 0) {
      addLog("Error: Recipiente de agua vacío");
      return;
    }
    
    const nuevoEstado = !isBombaActiva;
    
    try {
      await controlarBombaAgua(nuevoEstado);
      setIsBombaActiva(nuevoEstado);
      addLog(`Bomba de agua ${nuevoEstado ? 'activada' : 'desactivada'}`);
      
      // Simular flujo de agua
      if (nuevoEstado) {
        const interval = setInterval(() => {
          setNivelAgua(prev => Math.max(0, prev - 1));
          setPlatoAgua(prev => Math.min(100, prev + 2));
          
          if (platoAgua >= 90) {
            clearInterval(interval);
            addLog("Plato de agua lleno");
          }
        }, 500);
        
        return () => clearInterval(interval);
      }
    } catch (error) {
      addLog("Error al controlar bomba de agua");
      console.error(error);
    }
  };

  // Reiniciar platos
  const resetPlatoComida = () => {
    setPlatoComida(0);
    addLog("Plato de comida reiniciado");
  };

  const resetPlatoAgua = () => {
    setPlatoAgua(0);
    addLog("Plato de agua reiniciado");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Conectando con el dispositivo {macAddress}...</p>
      </div>
    );
  }

  return (
    <div className="iot-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Alimentador Automático de Mascotas</h1>
        <div className={`connection-status ${conectado ? 'connected' : 'disconnected'}`}>
          {conectado ? 'Conectado' : 'Desconectado'} | Dispositivo: {macAddress}
        </div>
      </header>

      {/* Contenedores principales */}
      <div className="main-content">
        {/* Panel de control */}
        <div className="control-panel">
          <div className="control-card">
            <h2>Dispensador de Comida</h2>
            <div className="indicator-container">
              <div className="level-indicator">
                <div 
                  className="level-fill food" 
                  style={{ width: `${nivelComida}%` }}
                ></div>
                <span>{nivelComida}%</span>
              </div>
              <p>Recipiente principal</p>
            </div>
            
            <button 
              className={`control-btn ${isDispensando ? 'active' : ''}`}
              onClick={handleDispensarComida}
              disabled={isDispensando || !conectado || nivelComida <= 0}
            >
              {isDispensando ? (
                <>
                  <span className="spinner-small"></span> Dispensando...
                </>
              ) : (
                'Dispensar Comida'
              )}
            </button>
          </div>

          <div className="control-card">
            <h2>Bomba de Agua</h2>
            <div className="indicator-container">
              <div className="level-indicator">
                <div 
                  className="level-fill water" 
                  style={{ width: `${nivelAgua}%` }}
                ></div>
                <span>{nivelAgua}%</span>
              </div>
              <p>Recipiente principal</p>
            </div>
            
            <button 
              className={`control-btn ${isBombaActiva ? 'active' : ''}`}
              onClick={handleBombaAgua}
              disabled={!conectado || nivelAgua <= 0}
            >
              {isBombaActiva ? 'Detener Agua' : 'Activar Agua'}
            </button>
          </div>
        </div>

        {/* Estado de los platos */}
        <div className="plates-panel">
          <div className="plate-card">
            <h3>Plato de Comida</h3>
            <div className="plate-visual">
              <div 
                className="food-level" 
                style={{ height: `${platoComida}%` }}
              ></div>
            </div>
            <div className="plate-info">
              <span>{platoComida}% lleno</span>
              <button 
                className="reset-btn"
                onClick={resetPlatoComida}
                disabled={platoComida <= 0}
              >
                Reiniciar
              </button>
            </div>
          </div>

          <div className="plate-card">
            <h3>Plato de Agua</h3>
            <div className="plate-visual">
              <div 
                className="water-level" 
                style={{ height: `${platoAgua}%` }}
              ></div>
            </div>
            <div className="plate-info">
              <span>{platoAgua}% lleno</span>
              <button 
                className="reset-btn"
                onClick={resetPlatoAgua}
                disabled={platoAgua <= 0}
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de logs */}
      <div className="logs-panel">
        <h3>Registro de Actividad</h3>
        <div className="logs-container">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                {log}
              </div>
            ))
          ) : (
            <p>No hay actividad registrada</p>
          )}
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="system-status">
        <div className="status-item">
          <span className="status-label">Conexión:</span>
          <span className={`status-value ${conectado ? 'good' : 'bad'}`}>
            {conectado ? 'Estable' : 'Inactiva'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Última actualización:</span>
          <span className="status-value">
            {datos.ultimaComida ? 
              `${Math.floor(datos.ultimaComida / 1000)} segundos` : 
              'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;