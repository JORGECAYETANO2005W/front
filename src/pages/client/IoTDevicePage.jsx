import React, { useState, useEffect } from 'react';
import '../../styles/IoT.css';

function IoTDevicePage() {
  const [foodStatus, setFoodStatus] = useState({
    active: false,
    value: 70 // Percentage full
  });
  
  const [waterStatus, setWaterStatus] = useState({
    active: false,
    value: 60 // Percentage full
  });
  
  const [lastFed, setLastFed] = useState(new Date());
  const [nextScheduled, setNextScheduled] = useState(new Date(Date.now() + 6 * 60 * 60 * 1000)); // 6 hours later

  const toggleFoodDispenser = () => {
    setFoodStatus(prev => ({
      ...prev,
      active: !prev.active
    }));
    
    if (!foodStatus.active) {
      // When activating, simulate dispensing food
      setTimeout(() => {
        setFoodStatus(prev => ({
          ...prev,
          active: false,
          value: Math.min(100, prev.value + 30)
        }));
        setLastFed(new Date());
      }, 3000);
    }
  };

  const toggleWaterDispenser = () => {
    setWaterStatus(prev => ({
      ...prev,
      active: !prev.active
    }));
    
    if (!waterStatus.active) {
      // When activating, simulate dispensing water
      setTimeout(() => {
        setWaterStatus(prev => ({
          ...prev,
          active: false,
          value: Math.min(100, prev.value + 30)
        }));
      }, 3000);
    }
  };

  const getFoodLevelText = (level) => {
    if (level > 70) return "Lleno";
    if (level > 30) return "Medio";
    return "Casi vacío";
  };

  const getWaterLevelText = (level) => {
    if (level > 70) return "Lleno";
    if (level > 30) return "Medio";
    return "Casi vacío";
  };

  return (
    <div className="pet-dispenser-container">
      <div className="pet-dispenser-header">
        <h1>Dispensador de Comida para Mascotas</h1>
        <p>Control de alimentación y agua para tu mascota
        </p>
      </div>
      
      <div className="status-overview">
        <div className="status-card">
          <p>Última alimentación: {lastFed.toLocaleTimeString()}</p>
        </div>
        <div className="status-card">
          <p>Próxima programada: {nextScheduled.toLocaleTimeString()}</p>
        </div>
      </div>
      
      <div className="dispensers-container">
        {/* Food Dispenser Control */}
        <div className="dispenser-card">
          <div className="dispenser-icon-container">
            <div className={`food-icon ${foodStatus.active ? 'active' : ''}`}></div>
          </div>
          <div className="dispenser-info">
            <h2>Dispensador de Comida</h2>
            <div className="level-indicator">
              <div className="level-bar">
                <div 
                  className="level-fill food" 
                  style={{ width: `${foodStatus.value}%` }}
                ></div>
              </div>
              <div className="level-text">
                <span>{foodStatus.value}% - {getFoodLevelText(foodStatus.value)}</span>
              </div>
            </div>
            <div className="status-display">
              <span className={`status-badge ${foodStatus.active ? 'active' : 'inactive'}`}>
                {foodStatus.active ? 'Dispensando...' : 'En espera'}
              </span>
            </div>
            <div className="control-buttons">
              <button 
                className={`control-btn ${foodStatus.active ? 'on-btn' : ''}`}
                onClick={toggleFoodDispenser}
                disabled={foodStatus.active}
              >
                {foodStatus.active ? 'Dispensando...' : 'Dispensar Comida'}
              </button>
            </div>
          </div>
        </div>

        {/* Water Dispenser Control */}
        <div className="dispenser-card">
          <div className="dispenser-icon-container">
            <div className={`water-icon ${waterStatus.active ? 'active' : ''}`}></div>
          </div>
          <div className="dispenser-info">
            <h2>Dispensador de Agua</h2>
            <div className="level-indicator">
              <div className="level-bar">
                <div 
                  className="level-fill water" 
                  style={{ width: `${waterStatus.value}%` }}
                ></div>
              </div>
              <div className="level-text">
                <span>{waterStatus.value}% - {getWaterLevelText(waterStatus.value)}</span>
              </div>
            </div>
            <div className="status-display">
              <span className={`status-badge ${waterStatus.active ? 'active' : 'inactive'}`}>
                {waterStatus.active ? 'Dispensando...' : 'En espera'}
              </span>
            </div>
            <div className="control-buttons">
              <button 
                className={`control-btn ${waterStatus.active ? 'on-btn' : ''}`}
                onClick={toggleWaterDispenser}
                disabled={waterStatus.active}
              >
                {waterStatus.active ? 'Dispensando...' : 'Dispensar Agua'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="schedule-section">
        <h3>Programación de Alimentación</h3>
        <div className="schedule-times">
          <div className="schedule-time">
            <span>8:00 AM</span>
            <span className="schedule-active">✓</span>
          </div>
          <div className="schedule-time">
            <span>2:00 PM</span>
            <span className="schedule-active">✓</span>
          </div>
          <div className="schedule-time">
            <span>8:00 PM</span>
            <span className="schedule-active">✓</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-footer">
        <p>Actualizado: {new Date().toLocaleTimeString()}</p>
        <p>VetCare PetFeeder Pro v1.0</p>
      </div>
    </div>
  );
}

export default IoTDevicePage;