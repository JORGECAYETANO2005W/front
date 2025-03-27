import React, { useEffect, useState } from 'react';
import { useFAQs } from '../../context/preguntasFre';
import '../../styles/nosotros.css'; 

function PreguntasFrecuentes() {
  const { faqs, getFAQs } = useFAQs();
  const [openFAQ, setOpenFAQ] = useState(null);
  
  useEffect(() => {
    // Load FAQs when component mounts
    getFAQs();
  }, []);
  
  // Filter FAQs to show only active ones (estado: true)
  const activeFAQs = faqs.filter(faq => faq.estado === true);
  
  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };
  
  return (
    <div className="nosotros-container">
      <div className="nosotros-header">
        <h1>Preguntas Frecuentes</h1>
        <div className="nosotros-separator"></div>
      </div>
      
      <div className="nosotros-section">
        <h2>Consultas Comunes</h2>
        
        <div className="nosotros-politicas">
          <div className="politicas-accordion">
            {activeFAQs.length > 0 ? (
              activeFAQs.map((faq) => (
                <div className="politica-item" key={faq._id}>
                  <div 
                    className="politica-header" 
                    onClick={() => toggleFAQ(faq._id)}
                  >
                    <h3>{faq.pregunta}</h3>
                    <button className="politica-toggle">
                      {openFAQ === faq._id ? '−' : '+'}
                    </button>
                  </div>
                  
                  {openFAQ === faq._id && (
                    <div 
                      className="politica-content" 
                      style={{ 
                        maxHeight: openFAQ === faq._id ? '500px' : '0',
                        padding: openFAQ === faq._id ? '1.5rem' : '0 1.5rem'
                      }}
                    >
                      <p>{faq.respuesta}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="nosotros-p">No hay preguntas frecuentes disponibles en este momento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreguntasFrecuentes;

