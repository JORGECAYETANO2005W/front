import React, { useEffect } from "react";
import { useContactos } from "../context/ContactoContext";

function ContactoList() {
  const { contactos, getContactos, deleteContacto, updateEstadoContacto } = useContactos();

  useEffect(() => {
    getContactos();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-welcome-title">Lista de Contactos</h1>
      <div className="admin-dashboard-grid">
        {contactos.map((contacto) => (
          <div key={contacto._id} className="admin-dashboard-card">
            <div className="admin-card-content">
              <h2>{contacto.telefono}</h2>
              <p>{contacto.email}</p>
              <p>Estado: {contacto.estado ? "Activo" : "Inactivo"}</p>
              <button
                className="admin-edit-button"
                onClick={() => updateEstadoContacto(contacto._id, !contacto.estado)}
              >
                {contacto.estado ? "Desactivar" : "Activar"}
              </button>
              <button
                className="admin-delete-button"
                onClick={() => deleteContacto(contacto._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactoList;