import { useEffect, useState } from "react";
import { useVisiones } from "../../context/visionContext"; // Ajusta la ruta según tu estructura
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css"; // Reutiliza el mismo archivo CSS

export default function VisionesList() {
  const { visiones, getVisiones, deleteVision, createVision, updateVision } = useVisiones();
  const [isOpen, setIsOpen] = useState(false);
  const [visionEdit, setVisionEdit] = useState({ title: "", description: "", estado: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisiones = async () => {
      try {
        setLoading(true);
        await getVisiones();
        setError(null);
      } catch (err) {
        setError("Error al cargar las visiones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisiones();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteVision(id);
      toast.success("Visión eliminada correctamente", {
        className: "vet-mission-toast-notification"
      });
    } catch (err) {
      toast.error("Error al eliminar la visión");
      console.error(err);
    }
  };

  const handleEdit = (vision) => {
    setVisionEdit({
      _id: vision._id,
      title: vision.title,
      description: vision.description,
      estado: vision.estado,
    });
    openModal();
  };

  const handleCreate = () => {
    setVisionEdit({ title: "", description: "", estado: true });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", visionEdit);

    try {
      if (visionEdit._id) {
        await updateVision(visionEdit._id, {
          title: visionEdit.title,
          description: visionEdit.description,
          estado: visionEdit.estado,
        });
        toast.success("Visión actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createVision({
          title: visionEdit.title,
          description: visionEdit.description,
          estado: visionEdit.estado,
        });
        toast.success("Visión creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la visión");
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
    getVisiones().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando visiones...</p>
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
        <h1 className="vet-mission-title">Lista de Visiones</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Visión
        </button>
      </div>

      {visiones.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay visiones disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera visión
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
              {visiones.map((vision) => (
                <tr key={vision._id}>
                  <td data-label="Nombre">{vision.title}</td>
                  <td data-label="Descripción">{vision.description}</td>
                  <td data-label="Estado">{vision.estado ? "Activo" : "Inactivo"}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(vision)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar visión"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(vision._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar visión"
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
                {visionEdit._id ? "Editar Visión" : "Crear Visión"}
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
                    value={visionEdit.title}
                    onChange={(e) => setVisionEdit({ ...visionEdit, title: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="description" className="vet-mission-form-label">Descripción:</label>
                  <textarea
                    id="description"
                    className="vet-mission-form-control vet-mission-textarea-control"
                    value={visionEdit.description}
                    onChange={(e) => setVisionEdit({ ...visionEdit, description: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="estado" className="vet-mission-form-label">Estado:</label>
                  <select
                    id="estado"
                    className="vet-mission-form-control"
                    value={visionEdit.estado}
                    onChange={(e) => setVisionEdit({ ...visionEdit, estado: e.target.value === "true" })}
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
                  {visionEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

