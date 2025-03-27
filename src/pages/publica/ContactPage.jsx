import React, { useEffect } from 'react';
import { useUbicaciones } from '../../context/UbicacionContext';
import { useRedesSociales } from '../../context/RedesSociales';
import { useContactos } from '../../context/contactosContext'; // Importar el contexto de contactos
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../../styles/contactos.css';

// Objeto con íconos y colores para las redes sociales
const socialMediaIcons = {
  Facebook: { icon: 'facebook-f', color: '#1877F2' },
  Instagram: { icon: 'instagram', color: '#E4405F' },
  Twitter: { icon: 'twitter', color: '#1DA1F2' },
  LinkedIn: { icon: 'linkedin-in', color: '#0A66C2' },
  YouTube: { icon: 'youtube', color: '#FF0000' },
  TikTok: { icon: 'tiktok', color: '#000000' },
  Pinterest: { icon: 'pinterest-p', color: '#BD081C' },
  Snapchat: { icon: 'snapchat-ghost', color: '#FFFC00' },
  WhatsApp: { icon: 'whatsapp', color: '#25D366' },
  Telegram: { icon: 'telegram-plane', color: '#26A5E4' },
  Reddit: { icon: 'reddit-alien', color: '#FF4500' },
  Tumblr: { icon: 'tumblr', color: '#36465D' },
  Flickr: { icon: 'flickr', color: '#FF0084' },
  Vimeo: { icon: 'vimeo-v', color: '#1AB7EA' },
  Spotify: { icon: 'spotify', color: '#1DB954' },
  Twitch: { icon: 'twitch', color: '#9146FF' },
  Discord: { icon: 'discord', color: '#5865F2' },
  Medium: { icon: 'medium-m', color: '#000000' },
  GitHub: { icon: 'github', color: '#181717' },
  Behance: { icon: 'behance', color: '#1769FF' }
};

function ContactPage() {
  const { ubicaciones, getUbicaciones } = useUbicaciones();
  const { redesSociales, getRedesSociales } = useRedesSociales();
  const { contactos, getContactos } = useContactos(); // Usar el contexto de contactos

  useEffect(() => {
    getUbicaciones();
    getRedesSociales();
    getContactos(); // Obtener los contactos al cargar el componente
  }, []);

  // Filtrar contactos activos
  const contactosActivos = contactos.filter((contacto) => contacto.estado === true);

  return (
    <div className="contactPage">
      <div className="contactPage__container">
        <div className="contactPage__header">
          <h1 className="contactPage__title">Contáctanos</h1>
          <p className="contactPage__subtitle">
            Estamos aquí para ayudarte a cuidar de tu mascota
          </p>
        </div>

        <div className="contactPage__content">
          <div className="contactPage__info">
            <div className="contactPage__infoSection">
              <h2 className="contactPage__sectionTitle">Información de Contacto</h2>
              <div className="contactPage__contactItems">
                {contactosActivos.map((contacto) => (
                  <div key={contacto._id} className="contactPage__contactItem">
                    <div className="contactPage__contactIcon">
                      {contacto.tipo === 'telefono' ? <FaPhone /> : <FaEnvelope />}
                      
                    </div>
                    <div className="contactPage__contactIcon">
                     <FaPhone />
                      
                    </div>
                    <div className="contactPage__contactText">
                      <h3>Correo Electronico</h3>
                      <p>{contacto.email}</p>
                      <h3>Telefono</h3>
                      <p>{contacto.telefono}</p>
                    </div>
                  </div>
                  
                ))}
              </div>
            </div>

            {ubicaciones.length > 0 && (
              <div className="contactPage__locations">
                <h2 className="contactPage__sectionTitle">Nuestras Ubicaciones</h2>
                <div className="contactPage__locationGrid">
                  {ubicaciones.map((ubicacion) => (
                    <div key={ubicacion._id} className="contactPage__locationCard">
                      <div className="contactPage__locationIcon">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="contactPage__locationDetails">
                        <h3>{ubicacion.nombre}</h3>
                        <p>{ubicacion.direccion}</p>
                        <p>{ubicacion.ciudad}, {ubicacion.pais}</p>
                        <p>CP: {ubicacion.codigoPostal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {redesSociales.length > 0 && (
              <div className="contactPage__social">
                <h2 className="contactPage__sectionTitle">Síguenos en Redes Sociales</h2>
                <div className="contactPage__socialGrid">
                  {redesSociales.map((red) => {
                    const socialInfo = socialMediaIcons[red.plataforma] || { icon: 'link', color: '#FF9800' };
                    return (
                      <a
                        key={red._id}
                        href={red.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contactPage__socialLink"
                        style={{
                          '--social-color': socialInfo.color
                        }}
                      >
                        <i className={`fab fa-${socialInfo.icon}`}></i>
                        <span>{red.plataforma}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;