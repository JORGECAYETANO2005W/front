import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../styles/tableUsers.css';
import UserDetailsModal from "../../components/UserDetailsModal";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUser, FaEnvelope, FaPhone, FaUserTag } from 'react-icons/fa';

function UsersManagementPage() {
  const { getUsers, deleteUser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError("Hubo un error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    (user.realName?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (user.role?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (searchTerm.toLowerCase() === "verificado" && user.isVerified === true) ||
    (searchTerm.toLowerCase() === "no verificado" && user.isVerified === false)
  );
  
  const handleDelete = async (id) => {
    try {
      if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        await deleteUser(id);
        // Actualiza la lista de usuarios después de eliminar
        const updatedUsers = users.filter(user => user._id !== id);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const openRoleModal = (user) => {
    setUserToEdit(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleRoleUpdate = async () => {
    if (!userToEdit || selectedRole === userToEdit.role) {
      setShowRoleModal(false);
      return;
    }

    setUpdateLoading(true);
    setUpdateMessage({ text: "", type: "" });

    try {
      const response = await updateUser(userToEdit._id, { role: selectedRole });
      
      // Update the user in the local state
      const updatedUsers = users.map(user => {
        if (user._id === userToEdit._id) {
          return { ...user, role: selectedRole };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setUpdateMessage({ 
        text: "Rol actualizado con éxito", 
        type: "success" 
      });
      
      setTimeout(() => {
        setShowRoleModal(false);
        setUpdateMessage({ text: "", type: "" });
      }, 2000);
      
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      setUpdateMessage({ 
        text: "Error al actualizar el rol", 
        type: "error" 
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-loading-container">
        <div className="user-loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className="user-retry-btn" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="user-empty-state">
        <FaUser size={40} color="#95a5a6" />
        <h3>No hay usuarios disponibles</h3>
        <p>No se encontraron usuarios en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="user-table-container">
      <div className="user-table-header">
        <h2 className="user-table-title">Gestión de Usuarios</h2>
        
        <div className="user-search-container">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={handleSearch}
            className="user-search-input"
          />
        </div>

      </div>
      <div className="user-table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th><span className="user-th-content"><FaUser /> Nombre</span></th>
              <th><span className="user-th-content"><FaUser /> Apellido</span></th>
              <th><span className="user-th-content"><FaEnvelope /> Email</span></th>
              <th><span className="user-th-content"><FaPhone /> Teléfono</span></th>
              <th><span className="user-th-content"><FaUserTag /> Rol</span></th>
              <th><span className="user-th-content">Estado</span></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.realName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td className={`user-role-column ${user.role === "admin" ? "user-admin-role" : "user-client-role"}`}>
                  {user.role === "admin" ? "Administrador" : "Cliente"}
                </td>
                <td className={`user-status-column ${user.isVerified ? "user-verified" : "user-unverified"}`}>
                  {user.isVerified ? "Verificado" : "No verificado"}
                </td>
                <td className="user-actions">
                  <button
                    className="user-view-btn"
                    onClick={() => openModal(user)}
                    title="Ver detalles"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="user-update-btn"
                    onClick={() => openRoleModal(user)}
                    title="Cambiar rol"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="user-delete-btn"
                    onClick={() => handleDelete(user._id)}
                    title="Eliminar usuario"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Modal para editar el rol */}
      {showRoleModal && userToEdit && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="user-modal-header">
              <h3>Editar Rol de Usuario</h3>
              <button 
                className="user-modal-close" 
                onClick={() => setShowRoleModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="user-modal-body">
              <p>
                <strong>Usuario:</strong> {userToEdit.realName} {userToEdit.lastName}
              </p>
              <p>
                <strong>Email:</strong> {userToEdit.email}
              </p>
              
              <div className="user-form-group">
                <label>Rol:</label>
                <select 
                  value={selectedRole} 
                  onChange={handleRoleChange}
                  className="user-select"
                  disabled={updateLoading}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              {updateMessage.text && (
                <div className={`user-message ${updateMessage.type === "success" ? "user-success" : "user-error"}`}>
                  {updateMessage.text}
                </div>
              )}
            </div>
            <div className="user-modal-footer">
              <button 
                className="user-cancel-btn" 
                onClick={() => setShowRoleModal(false)}
                disabled={updateLoading}
              >
                Cancelar
              </button>
              <button 
                className="user-save-btn" 
                onClick={handleRoleUpdate}
                disabled={updateLoading || selectedRole === userToEdit.role}
              >
                {updateLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagementPage;

