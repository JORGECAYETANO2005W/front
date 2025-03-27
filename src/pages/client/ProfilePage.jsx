import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../styles/profileAdmin.css';

function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    realName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    secretWord: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        realName: user.realName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        secretWord: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar contraseñas si se intenta cambiar
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Las contraseñas nuevas no coinciden");
        setLoading(false);
        return;
      }
    }

    try {
      // Verificar si el usuario está autenticado y tiene un ID
      if (!user || !user.id) {
        throw new Error("ID de usuario no disponible. Por favor, inicia sesión nuevamente.");
      }

      // Preparar datos para la actualización (eliminar confirmPassword)
      const updateData = { ...formData };
      delete updateData.confirmPassword;

      // Solo incluir campos de contraseña si se está actualizando la contraseña
      if (!updateData.newPassword) {
        delete updateData.currentPassword;
        delete updateData.newPassword;
      }

      await updateUser(user.id, updateData);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      toast.error(error.message || "Error al actualizar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente");
  };

  if (!user) {
    return (
      <div className="admin-profile-loading">
        <p>Cargando datos de usuario...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <div className="admin-welcome-section">
          <h1 className="admin-welcome-title">Bienvenido, <span className="admin-username">{user.realName}</span></h1>
          <p className="admin-role-badge">Cliente</p>
        </div>
        <div className="admin-actions">
          <button className="admin-logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="admin-form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="realName"
            value={formData.realName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Apellido</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Palabra Secreta</label>
          <input
            type="password"
            name="secretWord"
            value={formData.secretWord}
            onChange={handleChange}
            placeholder="Dejar en blanco para mantener la actual"
          />
        </div>

        <div className="admin-form-section">
          <h3>Cambiar Contraseña (opcional)</h3>

          <div className="admin-form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-save-button" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;

