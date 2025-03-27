import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useMqtt } from '../../hooks/useMqtt';
import { 
  FaWater, 
  FaUtensils, 
  FaThermometerHalf, 
  FaWifi, 
  FaBatteryFull 
} from 'react-icons/fa';

const UserDashboard = () => {
  const { id } = useParams();
  const macAddress = id || "";
  
  const { 
    datos, 
    conectado, 
    loading, 
    dispensarComida, 
    controlarBombaAgua 
  } = useMqtt(macAddress);
  
  // Estados locales para simulación
  const [nivelComida, setNivelComida] = useState(80);
  const [nivelAgua, setNivelAgua] = useState(60);
  const [logs, setLogs] = useState([]);

  // Estado de dispositivo
  const [estadoDispositivo, setEstadoDispositivo] = useState({
    bombaAgua: false,
    ultimaComida: null
  });

  // Efecto para actualizar estados
  useEffect(() => {
    if (!loading && datos) {
      setEstadoDispositivo({
        bombaAgua: datos.bombaAgua,
        ultimaComida: datos.ultimaComida
      });
      
      // Añadir log de actualización
      addLog(`Estado actualizado - Bomba: ${datos.bombaAgua ? 'ON' : 'OFF'}`);
    }
  }, [datos, loading]);

  // Función para agregar logs
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [
      `[${timestamp}] ${message}`, 
      ...prevLogs.slice(0, 9)  // Mantener solo los 10 logs más recientes
    ]);
  };

  // Manejadores de acciones
  const handleDispensarComida = async () => {
    if (nivelComida <= 0) {
      addLog("Error: Recipiente de comida vacío");
      return;
    }
    
    try {
      await dispensarComida();
      addLog("Dispensando comida...");
      
      // Simular reducción de comida
      setNivelComida(prev => Math.max(0, prev - 15));
    } catch (error) {
      addLog("Error al dispensar comida");
      console.error(error);
    }
  };

  const handleControlarBombaAgua = async () => {
    if (nivelAgua <= 0) {
      addLog("Error: Recipiente de agua vacío");
      return;
    }
    
    const nuevoEstado = !estadoDispositivo.bombaAgua;
    
    try {
      await controlarBombaAgua(nuevoEstado);
      addLog(`Bomba de agua ${nuevoEstado ? 'activada' : 'desactivada'}`);
      
      // Simular consumo de agua
      if (nuevoEstado) {
        const interval = setInterval(() => {
          setNivelAgua(prev => Math.max(0, prev - 1));
        }, 500);
        
        return () => clearInterval(interval);
      }
    } catch (error) {
      addLog("Error al controlar bomba de agua");
      console.error(error);
    }
  };

  // Renderizado condicional de carga
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Conectando con el dispositivo {macAddress}...</p>
      </div>
    );
  }

  return (
    <div className="pet-feeder-dashboard">
      {/* Encabezado */}
      <header className="dashboard-header">
        <h1>Alimentador Automático de Mascotas</h1>
        <div className="device-status">
          <span className={`status-indicator ${conectado ? 'online' : 'offline'}`}>
            <FaWifi /> {conectado ? 'Conectado' : 'Desconectado'}
          </span>
          <span>Dispositivo: {macAddress}</span>
        </div>
      </header>

      {/* Panel de Control Principal */}
      <div className="control-panel">
        {/* Dispensador de Comida */}
        <div className="control-card">
          <div className="card-header">
            <FaUtensils /> Dispensador de Comida
          </div>
          <div className="level-indicator">
            <div 
              className="level-bar food" 
              style={{ width: `${nivelComida}%` }}
            ></div>
            <span>{nivelComida}%</span>
          </div>
          <button 
            onClick={handleDispensarComida}
            disabled={!conectado || nivelComida <= 0}
            className="action-btn"
          >
            Dispensar Comida
          </button>
        </div>

        {/* Control de Agua */}
        <div className="control-card">
          <div className="card-header">
            <FaWater /> Sistema de Agua
          </div>
          <div className="level-indicator">
            <div 
              className="level-bar water" 
              style={{ width: `${nivelAgua}%` }}
            ></div>
            <span>{nivelAgua}%</span>
          </div>
          <button 
            onClick={handleControlarBombaAgua}
            disabled={!conectado || nivelAgua <= 0}
            className={`action-btn ${estadoDispositivo.bombaAgua ? 'active' : ''}`}
          >
            {estadoDispositivo.bombaAgua ? 'Detener Agua' : 'Activar Agua'}
          </button>
        </div>
      </div>

      {/* Panel de Estado del Sistema */}
      <div className="system-status">
        <div className="status-grid">
          <div className="status-item">
            <FaThermometerHalf />
            <span>Última Actualización:</span>
            <span>
              {datos.ultimaComida 
                ? `${Math.floor(datos.ultimaComida / 1000)} segundos` 
                : 'N/A'}
            </span>
          </div>
          <div className="status-item">
            <FaBatteryFull />
            <span>Estado Bomba:</span>
            <span>{estadoDispositivo.bombaAgua ? 'Activa' : 'Inactiva'}</span>
          </div>
        </div>
      </div>

      {/* Registro de Actividad */}
      <div className="activity-log">
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
    </div>
  );
};

export default UserDashboard;