import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCitas } from "../../context/CitasContext";
import "../../styles/UserCitas.css";

const UserCitas = () => {
  const { user } = useAuth();
  const { getCitasByUser, deleteCita, createCita, updateCita } = useCitas();
  const [citas, setCitas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCita, setCurrentCita] = useState({
    _id: "",
    fecha: "",
    horario: "",
    estado: true,
  });

  useEffect(() => {
    const fetchCitas = async () => {
      if (!user || !user.id) return;
      try {
        const citas = await getCitasByUser(user.id);
        setCitas(citas);
      } catch (error) {
        console.error("Error al obtener las citas:", error);
      }
    };

    fetchCitas();
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openEditModal = (cita) => {
    setCurrentCita(cita);
    setIsModalOpen(true);
  };

  const handleCreateOrUpdateCita = async (e) => {
    e.preventDefault();

    const citaData = {
      fecha: e.target.fecha.value,
      horario: e.target.horario.value,
      estado: true,
      userId: user.id,
    };

    try {
      if (currentCita._id) {
        await updateCita(currentCita._id, citaData);
      } else {
        await createCita(citaData);
      }
      const citasActualizadas = await getCitasByUser(user.id);
      setCitas(citasActualizadas);
      setIsModalOpen(false);
      setCurrentCita({ _id: "", fecha: "", horario: "", estado: true });
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  };

  return (
    <div className="userCitas__container">
      <h1 className="userCitas__title">Mis Citas</h1>

      {!user ? (
        <p className="userCitas__loading">Cargando usuario...</p>
      ) : citas.length === 0 ? (
        <div className="userCitas__empty">
          <p className="userCitas__emptyText">No tienes citas aún.</p>
          <button className="userCitas__newButton" onClick={openModal}>
            Crear Nueva Cita
          </button>
        </div>
      ) : (
        <div className="userCitas__list">
          {citas.map((cita) => (
            <div key={cita._id} className="userCitas__card">
              <div className="userCitas__cardHeader">
                <h2 className="userCitas__cardDate">
                  {new Date(cita.fecha).toLocaleDateString()}
                </h2>
                <span className={`userCitas__status ${cita.estado ? "userCitas__statusActive" : "userCitas__statusInactive"}`}>
                  {cita.estado ? "Activa" : "Inactiva"}
                </span>
              </div>
              <div className="userCitas__cardBody">
                <p className="userCitas__cardTime">
                  <span className="userCitas__cardLabel">Horario:</span> {cita.horario}
                </p>
              </div>
              <div className="userCitas__cardFooter">
                <button className="userCitas__editButton" onClick={() => openEditModal(cita)}>
                  Editar
                </button>
                <button className="userCitas__deleteButton" onClick={() => deleteCita(cita._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <button className="userCitas__addButton" onClick={openModal}>
            + Nueva Cita
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="userCitas__modalOverlay">
          <div className="userCitas__modal">
            <h2 className="userCitas__modalTitle">
              {currentCita._id ? "Editar Cita" : "Crear Cita"}
            </h2>
            <form className="userCitas__form" onSubmit={handleCreateOrUpdateCita}>
              <div className="userCitas__formGroup">
                <label className="userCitas__formLabel">Fecha:</label>
                <input
                  className="userCitas__formInput"
                  type="date"
                  name="fecha"
                  defaultValue={currentCita.fecha}
                  required
                />
              </div>

              <div className="userCitas__formGroup">
                <label className="userCitas__formLabel">Horario:</label>
                <input
                  className="userCitas__formInput"
                  type="text"
                  name="horario"
                  defaultValue={currentCita.horario}
                  placeholder="Ej: 15:30"
                  required
                />
              </div>

              <div className="userCitas__formActions">
                <button className="userCitas__saveButton" type="submit">
                  {currentCita._id ? "Actualizar" : "Guardar"}
                </button>
                <button
                  className="userCitas__cancelButton"
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentCita({ _id: "", fecha: "", horario: "", estado: true });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCitas;

