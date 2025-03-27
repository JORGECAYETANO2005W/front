import { createContext, useContext, useState } from "react";
import {
  getCitasRequest,
  getCitaRequest,
  createCitaRequest,
  updateCitaRequest,
  deleteCitaRequest,
  getCitasByUserRequest,
} from "../api/citas"; // Importa las peticiones HTTP

const CitaContext = createContext();

export const useCitas = () => {
  const context = useContext(CitaContext);
  if (!context) {
    throw new Error("useCitas must be used within a CitaProvider");
  }
  return context;
};

export function CitaProvider({ children }) {
  const [citas, setCitas] = useState([]);

  // Obtener todas las citas
  const getCitas = async () => {
    try {
      const res = await getCitasRequest();
      setCitas(res.data);
    } catch (error) {
      console.log("Error al obtener citas:", error);
    }
  };

  // Obtener una cita por su ID
  const getCita = async (id) => {
    try {
      const res = await getCitaRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la cita:", error);
    }
  };

  // Crear una nueva cita
  const createCita = async (cita) => {
    try {
      const res = await createCitaRequest(cita);
      if (res.status === 201) {
        setCitas([...citas, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la cita:", error);
    }
  };

  // Actualizar una cita existente
  const updateCita = async (id, cita) => {
    try {
      const res = await updateCitaRequest(id, cita);
      if (res.status === 200) {
        setCitas(
          citas.map((c) => (c._id === id ? { ...c, ...res.data } : c))
        );
      }
    } catch (error) {
      console.log("Error al actualizar la cita:", error);
    }
  };

  // Eliminar una cita
  const deleteCita = async (id) => {
    try {
      const res = await deleteCitaRequest(id);
      if (res.status === 204) {
        setCitas(citas.filter((cita) => cita._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la cita:", error);
    }
  };

  // Obtener las citas del usuario autenticado
  const getCitasByUser = async (userId) => { // Ahora recibe userId
    try {
        const res = await getCitasByUserRequest(userId); // Ahora pasamos userId
        return res.data;
    } catch (error) {
        console.log("Error al obtener las citas del usuario:", error);
        throw error;
    }
};

  return (
    <CitaContext.Provider
      value={{
        citas,
        getCitas,
        getCita,
        createCita,
        updateCita,
        deleteCita,
        getCitasByUser,
      }}
    >
      {children}
    </CitaContext.Provider>
  );
}

