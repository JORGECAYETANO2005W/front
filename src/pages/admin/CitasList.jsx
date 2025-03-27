import { useEffect, useState } from "react";
import { useCitas } from "../../context/CitasContext"; // Ajusta la ruta según tu estructura
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/mision.css"; // Reutiliza el mismo archivo CSS

export default function CitasList() {
  const { citas, getCitas, deleteCita, createCita, updateCita } = useCitas();
  const [isOpen, setIsOpen] = useState(false);
  const [citaEdit, setCitaEdit] = useState({ fecha: "", horario: "", estado: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true);
        await getCitas();
        setError(null);
      } catch (err) {
        setError("Error al cargar las citas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCita(id);
      toast.success("Cita eliminada correctamente", {
        className: "vet-mission-toast-notification",
      });
    } catch (err) {
      toast.error("Error al eliminar la cita");
      console.error(err);
    }
  };

  const handleEdit = (cita) => {
    setCitaEdit({
      _id: cita._id,
      fecha: cita.fecha,
      horario: cita.horario,
      estado: cita.estado,
    });
    openModal();
  };

  const handleCreate = () => {
    setCitaEdit({ fecha: "", horario: "", estado: true });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", citaEdit);

    try {
      if (citaEdit._id) {
        await updateCita(citaEdit._id, {
          fecha: citaEdit.fecha,
          horario: citaEdit.horario,
          estado: citaEdit.estado,
        });
        toast.success("Cita actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createCita({
          fecha: citaEdit.fecha,
          horario: citaEdit.horario,
          estado: citaEdit.estado,
        });
        toast.success("Cita creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la cita");
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
    getCitas().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando citas...</p>
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
        <h1 className="vet-mission-title">Lista de Citas</h1>
      </div>

      {citas.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay citas disponibles</p>
   
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita._id}>
                  <td data-label="Fecha">{cita.fecha}</td>
                  <td data-label="Horario">{cita.horario}</td>
                  <td data-label="Estado">{cita.estado ? "Activo" : "Inactivo"}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(cita)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar cita"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cita._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar cita"
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
                {citaEdit._id ? "Editar Cita" : "Crear Cita"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="fecha" className="vet-mission-form-label">Fecha:</label>
                  <input
                    id="fecha"
                    type="date"
                    className="vet-mission-form-control"
                    value={citaEdit.fecha}
                    onChange={(e) => setCitaEdit({ ...citaEdit, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="horario" className="vet-mission-form-label">Horario:</label>
                  <input
                    id="horario"
                    type="time"
                    className="vet-mission-form-control"
                    value={citaEdit.horario}
                    onChange={(e) => setCitaEdit({ ...citaEdit, horario: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="estado" className="vet-mission-form-label">Estado:</label>
                  <select
                    id="estado"
                    className="vet-mission-form-control"
                    value={citaEdit.estado}
                    onChange={(e) => setCitaEdit({ ...citaEdit, estado: e.target.value === "true" })}
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
                  {citaEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}