import React, { useEffect, useState } from 'react';
import { PawPrint, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useContactos } from '../../context/contactosContext'; // Importar el contexto de contactos
import '../../styles/footer.css';

// Footer Link Component
const FooterLink = ({ href, text }) => (
  <li>
    <a href={href} className="footer-link">
      {text}
    </a>
  </li>
);

// Social Icon Component
const SocialIcon = ({ icon }) => (
  <a href="#" className="social-icon">
    {icon}
  </a>
);

const Footer = () => {
  const { contactos, getContactos } = useContactos(); // Usar el contexto de contactos
  const [contactosActivos, setContactosActivos] = useState([]);

  useEffect(() => {
    getContactos(); // Obtener los contactos al cargar el componente
  }, []);

  useEffect(() => {
    // Filtrar contactos activos
    const activos = contactos.filter((contacto) => contacto.estado === true);
    setContactosActivos(activos);
  }, [contactos]);

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <PawPrint className="footer-logo-icon" />
              <span className="footer-logo-text">Huellitas</span>
            </div>
            <p className="footer-description">
              Cuidamos de tus mascotas con el amor y la atención que merecen. Servicios veterinarios de calidad desde 2010.
            </p>
            <div className="social-icons">
              <SocialIcon icon={<Facebook className="icon-sm" />} />
              <SocialIcon icon={<Instagram className="icon-sm" />} />
              <SocialIcon icon={<Twitter className="icon-sm" />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-heading">Enlaces Rápidos</h3>
            <ul className="footer-links-list">
              <FooterLink href="/" text="Inicio" />
              <FooterLink href="/catalog" text="Productos" />
              <FooterLink href="/cliente/citas" text="Reservar Cita" />
              <FooterLink href="/nosotros" text="Empresa" />
              <FooterLink href="/faqs" text="Preguntas Frecuentes" />
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="footer-contact">
            <h3 className="footer-heading">Contáctanos</h3>
            <ul className="contact-list">
              {contactosActivos.map((contacto) => (
                <>
                  {contacto.telefono && (
                    <li key={`${contacto._id}-telefono`} className="contact-item">
                      <Phone className="contact-icon" />
                      <span className="contact-text">{contacto.telefono}</span>
                    </li>
                  )}
                  {contacto.email && (
                    <li key={`${contacto._id}-email`} className="contact-item">
                      <Mail className="contact-icon" />
                      <span className="contact-text">{contacto.email}</span>
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="copyright">
        <div className="copyright-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} PetCare Veterinaria. Todos los derechos reservados.
          </p>
          <div className="legal-links">
            <ul className="legal-list">
              <li><a href="/privacidad" className="legal-link">Política de Privacidad</a></li>
              <li><a href="/terminos" className="legal-link">Términos de Servicio</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;