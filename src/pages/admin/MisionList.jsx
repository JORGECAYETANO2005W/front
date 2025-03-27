import { useEffect, useState } from "react";
import { useMisiones } from "../../context/misionContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../..//styles/mision.css";

export default function MisionesList() {
  const { misiones, getMisiones, deleteMision, createMision, updateMision } = useMisiones();
  const [isOpen, setIsOpen] = useState(false);
  const [misionEdit, setMisionEdit] = useState({ title: "", description: "", estado: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMisiones = async () => {
      try {
        setLoading(true);
        await getMisiones();
        setError(null);
      } catch (err) {
        setError("Error al cargar las misiones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiones();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMision(id);
      toast.success("Misión eliminada correctamente", {
        className: "vet-mission-toast-notification"
      });
    } catch (err) {
      toast.error("Error al eliminar la misión");
      console.error(err);
    }
  };

  const handleEdit = (mision) => {
    setMisionEdit({
      _id: mision._id,
      title: mision.title,
      description: mision.description,
      estado: mision.estado,
    });
    openModal();
  };

  const handleCreate = () => {
    setMisionEdit({ title: "", description: "", estado: true });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", misionEdit);

    try {
      if (misionEdit._id) {
        await updateMision(misionEdit._id, {
          title: misionEdit.title,
          description: misionEdit.description,
          estado: misionEdit.estado,
        });
        toast.success("Misión actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createMision({
          title: misionEdit.title,
          description: misionEdit.description,
          estado: misionEdit.estado,
        });
        toast.success("Misión creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la misión");
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
    getMisiones().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando misiones...</p>
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


      <div className="vet-mission-header">
        <h1 className="vet-mission-title">Lista de Misiones</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Misión
        </button>
      </div>

      {misiones.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay misiones disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera misión
          </button>
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {misiones.map((mision) => (
                <tr key={mision._id}>
                  <td data-label="Nombre">{mision.title}</td>
                  <td data-label="Descripción">{mision.description}</td>
                  <td data-label="Estado">{mision.estado ? "Activo" : "Inactivo"}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(mision)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar misión"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(mision._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar misión"
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
                {misionEdit._id ? "Editar Misión" : "Crear Misión"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="title" className="vet-mission-form-label">Nombre:</label>
                  <input
                    id="title"
                    type="text"
                    className="vet-mission-form-control"
                    value={misionEdit.title}
                    onChange={(e) => setMisionEdit({ ...misionEdit, title: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="description" className="vet-mission-form-label">Descripción:</label>
                  <textarea
                    id="description"
                    className="vet-mission-form-control vet-mission-textarea-control"
                    value={misionEdit.description}
                    onChange={(e) => setMisionEdit({ ...misionEdit, description: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="estado" className="vet-mission-form-label">Estado:</label>
                  <select
                    id="estado"
                    className="vet-mission-form-control"
                    value={misionEdit.estado}
                    onChange={(e) => setMisionEdit({ ...misionEdit, estado: e.target.value === "true" })}
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
                  {misionEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

