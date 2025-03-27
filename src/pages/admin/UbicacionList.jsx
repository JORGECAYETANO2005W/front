import { useEffect, useState } from "react";
import { useUbicaciones } from "../../context/UbicacionContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UbicacionList() {
  const { ubicaciones, getUbicaciones, deleteUbicacion, createUbicacion, updateUbicacion } = useUbicaciones();
  const [isOpen, setIsOpen] = useState(false);
  const [ubicacionEdit, setUbicacionEdit] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    pais: "",
    codigoPostal: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        setLoading(true);
        await getUbicaciones();
        setError(null);
      } catch (err) {
        setError("Error al cargar las ubicaciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUbicaciones();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUbicacion(id);
      toast.success("Ubicación eliminada correctamente", {
        className: "vet-mission-toast-notification",
      });
    } catch (err) {
      toast.error("Error al eliminar la ubicación");
      console.error(err);
    }
  };

  const handleEdit = (ubicacion) => {
    setUbicacionEdit({
      _id: ubicacion._id,
      nombre: ubicacion.nombre,
      direccion: ubicacion.direccion,
      ciudad: ubicacion.ciudad,
      pais: ubicacion.pais,
      codigoPostal: ubicacion.codigoPostal,
    });
    openModal();
  };

  const handleCreate = () => {
    setUbicacionEdit({
      nombre: "",
      direccion: "",
      ciudad: "",
      pais: "",
      codigoPostal: "",
    });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", ubicacionEdit);

    try {
      if (ubicacionEdit._id) {
        await updateUbicacion(ubicacionEdit._id, {
          nombre: ubicacionEdit.nombre,
          direccion: ubicacionEdit.direccion,
          ciudad: ubicacionEdit.ciudad,
          pais: ubicacionEdit.pais,
          codigoPostal: ubicacionEdit.codigoPostal,
        });
        toast.success("Ubicación actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createUbicacion({
          nombre: ubicacionEdit.nombre,
          direccion: ubicacionEdit.direccion,
          ciudad: ubicacionEdit.ciudad,
          pais: ubicacionEdit.pais,
          codigoPostal: ubicacionEdit.codigoPostal,
        });
        toast.success("Ubicación creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la ubicación");
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
    getUbicaciones().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando ubicaciones...</p>
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
        <h1 className="vet-mission-title">Lista de Ubicaciones</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Ubicación
        </button>
      </div>

      {ubicaciones.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay ubicaciones disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera ubicación
          </button>
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>País</th>
                <th>Código Postal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((ubicacion) => (
                <tr key={ubicacion._id}>
                  <td data-label="Nombre">{ubicacion.nombre}</td>
                  <td data-label="Dirección">{ubicacion.direccion}</td>
                  <td data-label="Ciudad">{ubicacion.ciudad}</td>
                  <td data-label="País">{ubicacion.pais}</td>
                  <td data-label="Código Postal">{ubicacion.codigoPostal}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(ubicacion)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar ubicación"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(ubicacion._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar ubicación"
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
                {ubicacionEdit._id ? "Editar Ubicación" : "Crear Ubicación"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="nombre" className="vet-mission-form-label">Nombre:</label>
                  <input
                    id="nombre"
                    type="text"
                    className="vet-mission-form-control"
                    value={ubicacionEdit.nombre}
                    onChange={(e) => setUbicacionEdit({ ...ubicacionEdit, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="direccion" className="vet-mission-form-label">Dirección:</label>
                  <input
                    id="direccion"
                    type="text"
                    className="vet-mission-form-control"
                    value={ubicacionEdit.direccion}
                    onChange={(e) => setUbicacionEdit({ ...ubicacionEdit, direccion: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="ciudad" className="vet-mission-form-label">Ciudad:</label>
                  <input
                    id="ciudad"
                    type="text"
                    className="vet-mission-form-control"
                    value={ubicacionEdit.ciudad}
                    onChange={(e) => setUbicacionEdit({ ...ubicacionEdit, ciudad: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="pais" className="vet-mission-form-label">País:</label>
                  <input
                    id="pais"
                    type="text"
                    className="vet-mission-form-control"
                    value={ubicacionEdit.pais}
                    onChange={(e) => setUbicacionEdit({ ...ubicacionEdit, pais: e.target.value })}
                    required
                  />
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="codigoPostal" className="vet-mission-form-label">Código Postal:</label>
                  <input
                    id="codigoPostal"
                    type="text"
                    className="vet-mission-form-control"
                    value={ubicacionEdit.codigoPostal}
                    onChange={(e) => setUbicacionEdit({ ...ubicacionEdit, codigoPostal: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="vet-mission-modal-footer">
                <button type="button" onClick={closeModal} className="vet-mission-btn vet-mission-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="vet-mission-btn vet-mission-btn-success">
                  {ubicacionEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}