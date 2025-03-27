import { useEffect, useState } from "react";
import { useCategories } from "../../context/CategoryContext"; // Ajusta la ruta según tu estructura
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css"; // Reutiliza el mismo archivo CSS

export default function CategoriesList() {
  const { categories, getCategories, deleteCategory, createCategory, updateCategory } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        await getCategories();
        setError(null);
      } catch (err) {
        setError("Error al cargar las categorías");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Categoría eliminada correctamente", {
        className: "vet-mission-toast-notification"
      });
    } catch (err) {
      toast.error("Error al eliminar la categoría");
      console.error(err);
    }
  };

  const handleEdit = (category) => {
    setCategoryEdit({
      _id: category._id,
      name: category.name,
      description: category.description,
    });
    openModal();
  };

  const handleCreate = () => {
    setCategoryEdit({ name: "", description: "" });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", categoryEdit);

    try {
      if (categoryEdit._id) {
        await updateCategory(categoryEdit._id, {
          name: categoryEdit.name,
          description: categoryEdit.description,
        });
        toast.success("Categoría actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createCategory({
          name: categoryEdit.name,
          description: categoryEdit.description,
        });
        toast.success("Categoría creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la categoría");
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
    getCategories().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando categorías...</p>
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
        <h1 className="vet-mission-title">Lista de Categorías</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Categoría
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay categorías disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera categoría
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
              {categories.map((category) => (
                <tr key={category._id}>
                  <td data-label="Nombre">{category.name}</td>
                  <td data-label="Descripción">{category.description}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(category)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar categoría"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar categoría"
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
                {categoryEdit._id ? "Editar Categoría" : "Crear Categoría"}
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
                    value={categoryEdit.name}
                    onChange={(e) => setCategoryEdit({ ...categoryEdit, name: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="description" className="vet-mission-form-label">Descripción:</label>
                  <textarea
                    id="description"
                    className="vet-mission-form-control vet-mission-textarea-control"
                    value={categoryEdit.description}
                    onChange={(e) => setCategoryEdit({ ...categoryEdit, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="vet-mission-modal-footer">
                <button type="button" onClick={closeModal} className="vet-mission-btn vet-mission-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="vet-mission-btn vet-mission-btn-success">
                  {categoryEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}