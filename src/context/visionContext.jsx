import { createContext, useContext, useState } from "react";
import {
  getVisionesRequest,
  getVisionRequest,
  createVisionRequest,
  updateVisionRequest,
  deleteVisionRequest,
} from "../api/vision"; 

const VisionContext = createContext();

export const useVisiones = () => {
  const context = useContext(VisionContext);
  if (!context) {
    throw new Error("useVisiones must be used within a VisionProvider");
  }
  return context;
};

export function VisionProvider({ children }) {
  const [visiones, setVisiones] = useState([]);

  // Obtener todas las visiones
  const getVisiones = async () => {
    try {
      const res = await getVisionesRequest();
      setVisiones(res.data);
    } catch (error) {
      console.log("Error al obtener visiones:", error);
    }
  };

  // Obtener una visión por su ID
  const getVision = async (id) => {
    try {
      const res = await getVisionRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la visión:", error);
    }
  };

  // Crear una nueva visión
  const createVision = async (vision) => {
    try {
      const res = await createVisionRequest(vision);
      if (res.status === 201) {
        setVisiones([...visiones, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la visión:", error);
    }
  };

  // Actualizar una visión existente
  const updateVision = async (id, vision) => {
    try {
      const res = await updateVisionRequest(id, vision);
      if (res.status === 200) {
        setVisiones(
          visiones.map((v) => (v._id === id ? { ...v, ...res.data } : v))
        );
      }
    } catch (error) {
      console.log("Error al actualizar la visión:", error);
    }
  };

  // Eliminar una visión
  const deleteVision = async (id) => {
    try {
      const res = await deleteVisionRequest(id);
      if (res.status === 204) {
        setVisiones(visiones.filter((vision) => vision._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la visión:", error);
    }
  };

  return (
    <VisionContext.Provider
      value={{
        visiones,
        getVisiones,
        getVision,
        createVision,
        updateVision,
        deleteVision,
      }}
    >
      {children}
    </VisionContext.Provider>
  );
}

