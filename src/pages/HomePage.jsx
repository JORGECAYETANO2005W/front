import React from "react";
import "../styles/home.css";
import { PawPrint, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-huellitas-container">
      <section className="homepage-hero-section">
        <div className="homepage-hero-content">
          <h2>Cuidamos a tus mascotas como si fueran nuestras</h2>
          <p>Atención veterinaria profesional con amor y dedicación</p>
          <button className="homepage-cta-button">
            
          </button>
        </div>
      </section>

      <section id="servicios" className="homepage-services-section">
        <h2 className="homepage-section-title">Nuestros Servicios</h2>
        <div className="homepage-services-grid">
          <div className="homepage-service-card">
            <div className="homepage-service-icon">🩺</div>
            <h3>Consulta General</h3>
            <p>Chequeos completos para mantener a tu mascota saludable.</p>
          </div>
          <div className="homepage-service-card">
            <div className="homepage-service-icon">💉</div>
            <h3>Vacunación</h3>
            <p>
              Programas de vacunación adaptados a las necesidades de tu mascota.
            </p>
          </div>
          <div className="homepage-service-card">
            <div className="homepage-service-icon">✂️</div>
            <h3>Peluquería</h3>
            <p>Servicio de estética y corte para perros y gatos.</p>
          </div>
          <div className="homepage-service-card">
            <div className="homepage-service-icon">🦷</div>
            <h3>Odontología</h3>
            <p>
              Cuidado dental para prevenir enfermedades y mejorar su calidad de
              vida.
            </p>
          </div>
        </div>
      </section>

      <section id="nosotros" className="homepage-about-section">
        <h2 className="homepage-section-title">Sobre Nosotros</h2>
        <div className="homepage-about-content">
          <div className="homepage-about-image">
            <img
              src="https://th.bing.com/th/id/R.3f92f296bfc37f1430874203e7d74326?rik=1IYKjdrjjYXq%2fA&pid=ImgRaw&r=0"
              alt="Equipo Veterinaria Huellitas"
            />
          </div>
          <div className="homepage-about-text">
            <p>
              En Veterinaria Huellitas contamos con un equipo de profesionales
              apasionados por el bienestar animal. Con más de 10 años de
              experiencia, nos hemos convertido en un referente en atención
              veterinaria en la zona.
            </p>
            <p>
              Nuestras instalaciones están equipadas con la mejor tecnología
              para ofrecer diagnósticos precisos y tratamientos efectivos para
              tus mascotas.
            </p>
          </div>
        </div>
      </section>

      <section id="galeria" className="homepage-gallery-section">
        <h2 className="homepage-section-title">Galería</h2>
        <div className="homepage-gallery-grid">
          <img
            src="https://th.bing.com/th/id/OIP.Iz3iVHItK6OuekBFJnGhjAHaFj?rs=1&pid=ImgDetMain"
            alt="Imagen de mascota 1"
          />
          <img
            src="https://www.hogarmania.com/archivos/202011/razas-perros-pequenos-6-yorkshire-XxXx80.jpg"
            alt="Imagen de mascota 2"
          />
          <img
            src="https://th.bing.com/th/id/OIP.eEWb823RI4l1IIYWo9pktAHaEK?rs=1&pid=ImgDetMain"
            alt="Imagen de mascota 3"
          />
          <img
            src="https://th.bing.com/th/id/OIP.jplClf0epon2FZiR-KxdSwAAAA?rs=1&pid=ImgDetMain"
            alt="Imagen de mascota 4"
          />
          <img
            src="https://tecolotito.elsiglodedurango.com.mx/i/2023/02/1149974.jpeg"
            alt="Imagen de mascota 5"
          />
          <img
            src="https://uploads-ssl.webflow.com/63634f4a7b868a399577cf37/63e10bf28752f848463155b3_razas%20de%20gatos.jpg"
            alt="Imagen de mascota 6"
          />
          <img
            src="https://th.bing.com/th/id/R.2d4436c6651ab857cebfbe71d98227ed?rik=tB2gro%2bIR2SACA&riu=http%3a%2f%2f4.bp.blogspot.com%2f-TRt-qbZsecI%2fUWtaZkdlKyI%2fAAAAAAAAAOQ%2fJmmiM5L6Pso%2fs1600%2ffotos-de-gatinhos-0-7-1.jpg&ehk=SE2ALhDG4RzN04iLg9%2fPdkZQGU1LNGvfyN1xA%2fbhiW8%3d&risl=&pid=ImgRaw&r=0"
            alt="Imagen de mascota 7"
          />
          <img
            src="https://th.bing.com/th/id/OIP.sq7MluSMzbyYemPM4Vr-gwHaE8?rs=1&pid=ImgDetMain"
            alt="Imagen de mascota 8"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
