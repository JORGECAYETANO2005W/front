import React, { useEffect, useState } from 'react';
import { useMisiones } from '../../context/misionContext';
import { useVisiones } from '../../context/visionContext';
import { usePoliticas } from '../../context/politicaContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../styles/nosotros.css';

function Nosotros() {
  const { misiones, getMisiones } = useMisiones();
  const { visiones, getVisiones } = useVisiones();
  const { politicas, getPoliticas } = usePoliticas();
  const [expandedPolicies, setExpandedPolicies] = useState({});

  useEffect(() => {
    getMisiones();
    getVisiones();
    getPoliticas();
  }, []);

  // Filter items with estado = true
  const activeMisiones = misiones.filter(mision => mision.estado === true);
  const activeVisiones = visiones.filter(vision => vision.estado === true);
  const activePoliticas = politicas.filter(politica => politica.estado === true);

  const togglePolicy = (id) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="nosotros-container">
      <div className="nosotros-header">
        <h1>Nosotros</h1>
        <div className="nosotros-separator"></div>
      </div>

      <div className="nosotros-content">
        {/* Sección de Misión */}
        <section className="nosotros-section nosotros-mision">
          <h2>Nuestra Misión</h2>
          <div className="nosotros-cards">
            {activeMisiones.map((mision) => (
              <div key={mision._id} className="nosotros-card">
                <h3>{mision.title}</h3>
                <p>{mision.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Visión */}
        <section className="nosotros-section nosotros-vision">
          <h2>Nuestra Visión</h2>
          <div className="nosotros-cards">
            {activeVisiones.map((vision) => (
              <div key={vision._id} className="nosotros-card">
                <h3>{vision.title}</h3>
                <p>{vision.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Políticas */}
        <section className="nosotros-section nosotros-politicas">
          <h2>Nuestras Políticas</h2>
          <div className="politicas-accordion">
            {activePoliticas.map((politica) => (
              <div key={politica._id} className="politica-item">
                <div 
                  className="politica-header" 
                  onClick={() => togglePolicy(politica._id)}
                >
                  <h3>{politica.title}</h3>
                  <button className="politica-toggle">
                    {expandedPolicies[politica._id] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                
                {expandedPolicies[politica._id] && (
                  <div className="politica-content">
                    <p>{politica.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="nosotros-footer">
        <p className='nosotros-p'>Comprometidos con el bienestar animal</p>
      </div>
    </div>
  );
}

export default Nosotros;

