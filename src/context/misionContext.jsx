import { createContext, useContext, useState } from "react";
import {
  getMisionesRequest,
  getMisionRequest,
  createMisionRequest,
  updateMisionRequest,
  deleteMisionRequest,
} from "../api/mision";

const MisionContext = createContext();

export const useMisiones = () => {
  const context = useContext(MisionContext);
  if (!context) {
    throw new Error("useMisiones must be used within a MisionProvider");
  }
  return context;
};

export function MisionProvider({ children }) {
  const [misiones, setMisiones] = useState([]);

  // Obtener todas las misiones
  const getMisiones = async () => {
    try {
      const res = await getMisionesRequest();
      setMisiones(res.data);
    } catch (error) {
      console.log("Error al obtener misiones:", error);
    }
  };

  // Obtener una misión por su ID
  const getMision = async (id) => {
    try {
      const res = await getMisionRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la misión:", error);
    }
  };

  // Crear una nueva misión
  const createMision = async (mision) => {
    try {
      const res = await createMisionRequest(mision);
      if (res.status === 201) {
        setMisiones([...misiones, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la misión:", error);
    }
  };

  // Actualizar una misión existente
  const updateMision = async (id, mision) => {
    try {
      const res = await updateMisionRequest(id, mision);
      if (res.status === 200) {
        setMisiones(
          misiones.map((m) => (m._id === id ? { ...m, ...res.data } : m))
        );
      }
    } catch (error) {
      console.log("Error al actualizar la misión:", error);
    }
  };

  // Eliminar una misión
  const deleteMision = async (id) => {
    try {
      const res = await deleteMisionRequest(id);
      if (res.status === 204) {
        setMisiones(misiones.filter((mision) => mision._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la misión:", error);
    }
  };

  return (
    <MisionContext.Provider
      value={{
        misiones,
        getMisiones,
        getMision,
        createMision,
        updateMision,
        deleteMision,
      }}
    >
      {children}
    </MisionContext.Provider>
  );
}

