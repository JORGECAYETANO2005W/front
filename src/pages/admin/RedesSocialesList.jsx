import { useEffect, useState } from "react";
import { useRedesSociales } from "../../context/RedesSociales";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RedesSocialesList() {
  const { redesSociales, getRedesSociales, deleteRedSocial, createRedSocial, updateRedSocial } = useRedesSociales();
  const [isOpen, setIsOpen] = useState(false);
  const [redSocialEdit, setRedSocialEdit] = useState({ plataforma: "", enlace: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista de redes sociales reconocidas
  const redesSocialesReconocidas = [
    "Facebook",
    "Instagram",
    "Twitter",
    "LinkedIn",
    "YouTube",
    "TikTok",
    "Pinterest",
    "Snapchat",
    "WhatsApp",
    "Telegram",
    "Reddit",
    "Tumblr",
    "Flickr",
    "Vimeo",
    "Spotify",
    "Twitch",
    "Discord",
    "Medium",
    "GitHub",
    "Behance",
  ];

  useEffect(() => {
    const fetchRedesSociales = async () => {
      try {
        setLoading(true);
        await getRedesSociales();
        setError(null);
      } catch (err) {
        setError("Error al cargar las redes sociales");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRedesSociales();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRedSocial(id);
      toast.success("Red social eliminada correctamente", {
        className: "vet-mission-toast-notification",
      });
    } catch (err) {
      toast.error("Error al eliminar la red social");
      console.error(err);
    }
  };

  const handleEdit = (redSocial) => {
    setRedSocialEdit({
      _id: redSocial._id,
      plataforma: redSocial.plataforma,
      enlace: redSocial.enlace,
    });
    openModal();
  };

  const handleCreate = () => {
    setRedSocialEdit({ plataforma: "", enlace: "" });
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", redSocialEdit);

    try {
      if (redSocialEdit._id) {
        await updateRedSocial(redSocialEdit._id, {
          plataforma: redSocialEdit.plataforma,
          enlace: redSocialEdit.enlace,
        });
        toast.success("Red social actualizada correctamente", {
          className: "vet-mission-toast-notification",
        });
      } else {
        await createRedSocial({
          plataforma: redSocialEdit.plataforma,
          enlace: redSocialEdit.enlace,
        });
        toast.success("Red social creada correctamente", {
          className: "vet-mission-toast-notification",
        });
      }
      closeModal();
    } catch (err) {
      toast.error("Error al guardar la red social");
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
    getRedesSociales().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="vet-mission-container">
        <div className="vet-mission-loading-container">
          <div className="vet-mission-loading-spinner"></div>
          <p>Cargando redes sociales...</p>
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
        <h1 className="vet-mission-title">Lista de Redes Sociales</h1>
        <button onClick={handleCreate} className="vet-mission-create-btn">
          Crear Nueva Red Social
        </button>
      </div>

      {redesSociales.length === 0 ? (
        <div className="vet-mission-empty-state">
          <p className="vet-mission-text">No hay redes sociales disponibles</p>
          <button onClick={handleCreate} className="vet-mission-create-btn">
            Crear tu primera red social
          </button>
        </div>
      ) : (
        <div className="vet-mission-table-responsive">
          <table className="vet-mission-table">
            <thead>
              <tr>
                <th>Plataforma</th>
                <th>Enlace</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {redesSociales.map((redSocial) => (
                <tr key={redSocial._id}>
                  <td data-label="Plataforma">{redSocial.plataforma}</td>
                  <td data-label="Enlace">{redSocial.enlace}</td>
                  <td data-label="Acciones">
                    <div className="vet-mission-actions">
                      <button
                        onClick={() => handleEdit(redSocial)}
                        className="vet-mission-edit-btn"
                        aria-label="Editar red social"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(redSocial._id)}
                        className="vet-mission-delete-btn"
                        aria-label="Eliminar red social"
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
                {redSocialEdit._id ? "Editar Red Social" : "Crear Red Social"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vet-mission-modal-body">
                <div className="vet-mission-form-group">
                  <label htmlFor="plataforma" className="vet-mission-form-label">Plataforma:</label>
                  <select
                    id="plataforma"
                    className="vet-mission-form-control"
                    value={redSocialEdit.plataforma}
                    onChange={(e) => setRedSocialEdit({ ...redSocialEdit, plataforma: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una plataforma</option>
                    {redesSocialesReconocidas.map((plataforma) => (
                      <option key={plataforma} value={plataforma}>
                        {plataforma}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="vet-mission-form-group">
                  <label htmlFor="enlace" className="vet-mission-form-label">Enlace:</label>
                  <input
                    id="enlace"
                    type="url"
                    className="vet-mission-form-control"
                    value={redSocialEdit.enlace}
                    onChange={(e) => setRedSocialEdit({ ...redSocialEdit, enlace: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="vet-mission-modal-footer">
                <button type="button" onClick={closeModal} className="vet-mission-btn vet-mission-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="vet-mission-btn vet-mission-btn-success">
                  {redSocialEdit._id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

