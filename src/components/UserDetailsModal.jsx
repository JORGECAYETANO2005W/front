import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaKey, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../styles/userModal.css'

function UserDetailsModal({ user, onClose }) {
  // Formato de fecha para createdAt y updatedAt
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
  };

  return (
    <div className="user-modal-backdrop">
      <div className="user-modal-content">
        <div className="user-modal-header">
          <h2 className="user-modal-title">Detalles del Usuario</h2>
          <button className="user-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="user-details-section">
          <div className="user-info-header">
            <div className="user-avatar">
              {user.realName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className="user-primary-info">
              <h3>{`${user.realName} ${user.lastName}`}</h3>
              <p className={`user-role-column ${user.role === "admin" ? "user-admin-role" : "user-client-role"}`}>
                {user.role === "admin" ? "Administrador" : "Cliente"}
              </p>
              <p className={`user-status ${user.isVerified ? "user-verified" : "user-unverified"}`}>
                {user.isVerified ? <><FaCheckCircle /> Verificado</> : <><FaTimesCircle /> No verificado</>}
              </p>
            </div>
          </div>

          <div className="user-details-grid">
            <div className="user-details-row">
              <div className="user-details-label"><FaUser /> Nombre completo</div>
              <div className="user-details-value">{`${user.realName} ${user.lastName}`}</div>
            </div>

            <div className="user-details-row">
              <div className="user-details-label"><FaEnvelope /> Correo electrónico</div>
              <div className="user-details-value">{user.email}</div>
            </div>

            <div className="user-details-row">
              <div className="user-details-label"><FaPhone /> Teléfono</div>
              <div className="user-details-value">{user.phoneNumber}</div>
            </div>

            <div className="user-details-row">
              <div className="user-details-label"><FaUserTag /> Rol</div>
              <div className="user-details-value">{user.role === "admin" ? "Administrador" : "Cliente"}</div>
            </div>

            <div className="user-details-row">
              <div className="user-details-label"><FaKey /> Palabra secreta</div>
              <div className="user-details-value">••••••••</div>
            </div>

            <div className="user-details-row">
              <div className="user-details-label"><FaCalendarAlt /> Fecha de creación</div>
              <div className="user-details-value">{formatDate(user.createdAt)}</div>
            </div>

            <div className="user-details-row">
              <div className="user-details-label"><FaCalendarAlt /> Última actualización</div>
              <div className="user-details-value">{formatDate(user.updatedAt)}</div>
            </div>
          </div>
        </div>
        <div className="user-modal-footer">
          <button className="user-create-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;

