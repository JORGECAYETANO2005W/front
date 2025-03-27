import { useEffect, useState } from "react";
import { useMarcas } from "../../context/MarcaContext"; // Ajusta la ruta según tu estructura
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css"; // Reutiliza el mismo archivo CSS

export default function MarcasList() {
  const { marcas, getMarcas, deleteMarca, createMarca, updateMarca } = useMarcas();
  const [isOpen, setIsOpen] = useState(false);
  const [marcaEdit, setMarcaEdit] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setLoading(true);
        await getMarcas();
        setError(null);
      } catch (err) {
        setError("Error al cargar las marcas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMarca(id);
      toast.success("Marca eliminada correctamente", {
        className: "vet-mission-toast-notification"
      });
    } catch (err) {
      toast.error("Error al eliminar la marca");
      console.error(err);
    }
  };

  const handleEdit = (marca) => {
    setMarcaEdit({
      _id: marca._id,
      name: marca.name,
      description: marca.description,
    });
    openModal();
  };

  const handleCreate = () => {
    setMarcaEdit({ name: "", description: "" });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", marcaEdit);

    try {
      if (marcaEdit._id) {
        await updateMarca(marcaEdit._id, {
          name: marcaEdit.name,
          description: marcaEdit.description,
        });
        toast.success("Marca actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createMarca({
          name: marcaEdit.name,
          description: marcaEdit.description,
        });
        toast.success("Marca creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la marca");
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
    getMarcas().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando marcas...</p>
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
        <h1 className="vet-mission-title">Lista de Marcas</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Marca
        </button>
      </div>

      {marcas.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay marcas disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera marca
          </button>
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((marca) => (
                <tr key={marca._id}>
                  <td data-label="Nombre">{marca.name}</td>
                  <td data-label="Descripción">{marca.description}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(marca)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar marca"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(marca._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar marca"
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
                {marcaEdit._id ? "Editar Marca" : "Crear Marca"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="name" className="vet-mission-form-label">Nombre:</label>
                  <input
                    id="name"
                    type="text"
                    className="vet-mission-form-control"
                    value={marcaEdit.name}
                    onChange={(e) => setMarcaEdit({ ...marcaEdit, name: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="description" className="vet-mission-form-label">Descripción:</label>
                  <textarea
                    id="description"
                    className="vet-mission-form-control vet-mission-textarea-control"
                    value={marcaEdit.description}
                    onChange={(e) => setMarcaEdit({ ...marcaEdit, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="vet-mission-modal-footer">
                <button type="button" onClick={closeModal} className="vet-mission-btn vet-mission-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="vet-mission-btn vet-mission-btn-success">
                  {marcaEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}