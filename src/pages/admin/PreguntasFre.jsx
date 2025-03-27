import { useEffect, useState } from "react";
import { useFAQs } from "../../context/preguntasFre"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css"; 

export default function FAQsList() {
  const { faqs, getFAQs, deleteFAQ, createFAQ, updateFAQ } = useFAQs();
  const [isOpen, setIsOpen] = useState(false);
  const [faqEdit, setFAQEdit] = useState({ pregunta: "", respuesta: "", estado: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        await getFAQs();
        setError(null);
      } catch (err) {
        setError("Error al cargar las FAQs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFAQ(id);
      toast.success("FAQ eliminada correctamente", {
        className: "vet-mission-toast-notification"
      });
    } catch (err) {
      toast.error("Error al eliminar la FAQ");
      console.error(err);
    }
  };

  const handleEdit = (faq) => {
    setFAQEdit({
      _id: faq._id,
      pregunta: faq.pregunta,
      respuesta: faq.respuesta,
      estado: faq.estado,
    });
    openModal();
  };

  const handleCreate = () => {
    setFAQEdit({ pregunta: "", respuesta: "", estado: true });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", faqEdit);

    try {
      if (faqEdit._id) {
        await updateFAQ(faqEdit._id, {
          pregunta: faqEdit.pregunta,
          respuesta: faqEdit.respuesta,
          estado: faqEdit.estado,
        });
        toast.success("FAQ actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createFAQ({
          pregunta: faqEdit.pregunta,
          respuesta: faqEdit.respuesta,
          estado: faqEdit.estado,
        });
        toast.success("FAQ creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la FAQ");
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
    getFAQs().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando FAQs...</p>
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
        <h1 className="vet-mission-title">Lista de FAQs</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay FAQs disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera FAQ
          </button>
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq._id}>
                  <td data-label="Pregunta">{faq.pregunta}</td>
                  <td data-label="Respuesta">{faq.respuesta}</td>
                  <td data-label="Estado">{faq.estado ? "Activo" : "Inactivo"}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar FAQ"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar FAQ"
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
                {faqEdit._id ? "Editar FAQ" : "Crear FAQ"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="pregunta" className="vet-mission-form-label">Pregunta:</label>
                  <input
                    id="pregunta"
                    type="text"
                    className="vet-mission-form-control"
                    value={faqEdit.pregunta}
                    onChange={(e) => setFAQEdit({ ...faqEdit, pregunta: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="respuesta" className="vet-mission-form-label">Respuesta:</label>
                  <textarea
                    id="respuesta"
                    className="vet-mission-form-control vet-mission-textarea-control"
                    value={faqEdit.respuesta}
                    onChange={(e) => setFAQEdit({ ...faqEdit, respuesta: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="estado" className="vet-mission-form-label">Estado:</label>
                  <select
                    id="estado"
                    className="vet-mission-form-control"
                    value={faqEdit.estado}
                    onChange={(e) => setFAQEdit({ ...faqEdit, estado: e.target.value === "true" })}
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
                  {faqEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}