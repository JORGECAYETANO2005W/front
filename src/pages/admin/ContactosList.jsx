import { useEffect, useState } from "react";
import { useContactos } from "../../context/contactosContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css";

export default function ContactosList() {
  const { contactos, getContactos, deleteContacto, createContacto, updateContacto } = useContactos();
  const [isOpen, setIsOpen] = useState(false);
  const [contactoEdit, setContactoEdit] = useState({ telefono: "", email: "", estado: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        setLoading(true);
        await getContactos();
        setError(null);
      } catch (err) {
        setError("Error al cargar los contactos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContacto(id);
      toast.success("Contacto eliminado correctamente", {
        className: "vet-mission-toast-notification",
      });
    } catch (err) {
      toast.error("Error al eliminar el contacto");
      console.error(err);
    }
  };

  const handleEdit = (contacto) => {
    setContactoEdit({
      _id: contacto._id,
      telefono: contacto.telefono,
      email: contacto.email,
      estado: contacto.estado,
    });
    openModal();
  };

  const handleCreate = () => {
    setContactoEdit({ telefono: "", email: "", estado: true });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", contactoEdit);

    try {
      if (contactoEdit._id) {
        await updateContacto(contactoEdit._id, {
          telefono: contactoEdit.telefono,
          email: contactoEdit.email,
          estado: contactoEdit.estado,
        });
        toast.success("Contacto actualizado correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createContacto({
          telefono: contactoEdit.telefono,
          email: contactoEdit.email,
          estado: contactoEdit.estado,
        });
        toast.success("Contacto creado correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar el contacto");
      console.error(err);
    }
  };

  const closeModal = () => {
    const modalOverlay = document.getElementById("vet-mission-modal-overlay");
    if (modalOverlay) {
      modalOverlay.classList.remove("vet-mission-active");

      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
      setIsOpen(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => {
      const modalOverlay = document.getElementById("vet-mission-modal-overlay");
      if (modalOverlay) {
        modalOverlay.classList.add("vet-mission-active");
      }
    }, 50);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    getContactos().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando contactos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-error-container">
          <h2>Ocurrió un error</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="vet-mission-retry-btn">
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vet-mission-container">
      <ToastContainer />

      <div className="vet-mission-header">
        <h1 className="vet-mission-title">Lista de Contactos</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nuevo Contacto
        </button>
      </div>

      {contactos.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay contactos disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primer contacto
          </button>
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto) => (
                <tr key={contacto._id}>
                  <td data-label="Teléfono">{contacto.telefono}</td>
                  <td data-label="Email">{contacto.email}</td>
                  <td data-label="Estado">{contacto.estado ? "Activo" : "Inactivo"}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(contacto)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar contacto"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(contacto._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar contacto"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <div id="vet-mission-modal-overlay" className="vet-mission-modal-overlay">
          <div className="vet-mission-modal-container">
            <div className="vet-mission-modal-header">
              <h2 className="vet-mission-modal-title">
                {contactoEdit._id ? "Editar Contacto" : "Crear Contacto"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="telefono" className="vet-mission-form-label">Teléfono:</label>
                  <input
                    id="telefono"
                    type="text"
                    className="vet-mission-form-control"
                    value={contactoEdit.telefono}
                    onChange={(e) => setContactoEdit({ ...contactoEdit, telefono: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="email" className="vet-mission-form-label">Email:</label>
                  <input
                    id="email"
                    type="email"
                    className="vet-mission-form-control"
                    value={contactoEdit.email}
                    onChange={(e) => setContactoEdit({ ...contactoEdit, email: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="estado" className="vet-mission-form-label">Estado:</label>
                  <select
                    id="estado"
                    className="vet-mission-form-control"
                    value={contactoEdit.estado}
                    onChange={(e) => setContactoEdit({ ...contactoEdit, estado: e.target.value === "true" })}
                    required
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="vet-mission-modal-footer">
                <button type="button" onClick={closeModal} className="vet-mission-btn vet-mission-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="vet-mission-btn vet-mission-btn-success">
                  {contactoEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

