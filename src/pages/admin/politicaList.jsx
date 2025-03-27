import { useEffect, useState } from "react";
import { usePoliticas } from "../../context/politicaContext"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css"; 

export default function PoliticasList() {
  const { politicas, getPoliticas, deletePolitica, createPolitica, updatePolitica } = usePoliticas();
  const [isOpen, setIsOpen] = useState(false);
  const [politicaEdit, setPoliticaEdit] = useState({ title: "", description: "", estado: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        setLoading(true);
        await getPoliticas();
        setError(null);
      } catch (err) {
        setError("Error al cargar las políticas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePolitica(id);
      toast.success("Política eliminada correctamente", {
        className: "vet-mission-toast-notification"
      });
    } catch (err) {
      toast.error("Error al eliminar la política");
      console.error(err);
    }
  };

  const handleEdit = (politica) => {
    setPoliticaEdit({
      _id: politica._id,
      title: politica.title,
      description: politica.description,
      estado: politica.estado,
    });
    openModal();
  };

  const handleCreate = () => {
    setPoliticaEdit({ title: "", description: "", estado: true });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", politicaEdit);

    try {
      if (politicaEdit._id) {
        await updatePolitica(politicaEdit._id, {
          title: politicaEdit.title,
          description: politicaEdit.description,
          estado: politicaEdit.estado,
        });
        toast.success("Política actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createPolitica({
          title: politicaEdit.title,
          description: politicaEdit.description,
          estado: politicaEdit.estado,
        });
        toast.success("Política creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la política");
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
    getPoliticas().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando políticas...</p>
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
        <h1 className="vet-mission-title">Lista de Políticas</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Política
        </button>
      </div>

      {politicas.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay políticas disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera política
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
              {politicas.map((politica) => (
                <tr key={politica._id}>
                  <td data-label="Nombre">{politica.title}</td>
                  <td data-label="Descripción">{politica.description}</td>
                  <td data-label="Estado">{politica.estado ? "Activo" : "Inactivo"}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(politica)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar política"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(politica._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar política"
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
                {politicaEdit._id ? "Editar Política" : "Crear Política"}
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
                    value={politicaEdit.title}
                    onChange={(e) => setPoliticaEdit({ ...politicaEdit, title: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="description" className="vet-mission-form-label">Descripción:</label>
                  <textarea
                    id="description"
                    className="vet-mission-form-control vet-mission-textarea-control"
                    value={politicaEdit.description}
                    onChange={(e) => setPoliticaEdit({ ...politicaEdit, description: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="estado" className="vet-mission-form-label">Estado:</label>
                  <select
                    id="estado"
                    className="vet-mission-form-control"
                    value={politicaEdit.estado}
                    onChange={(e) => setPoliticaEdit({ ...politicaEdit, estado: e.target.value === "true" })}
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
                  {politicaEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}