import { createContext, useContext, useState } from "react";
import {
  getUbicacionesRequest,
  getUbicacionRequest,
  createUbicacionRequest,
  updateUbicacionRequest,
  deleteUbicacionRequest,
} from "../api/ubicacion"; 

const UbicacionContext = createContext();

export const useUbicaciones = () => {
  const context = useContext(UbicacionContext);
  if (!context) {
    throw new Error("useUbicaciones must be used within a UbicacionProvider");
  }
  return context;
};

export function UbicacionProvider({ children }) {
  const [ubicaciones, setUbicaciones] = useState([]);

  // Obtener todas las ubicaciones
  const getUbicaciones = async () => {
    try {
      const res = await getUbicacionesRequest();
      setUbicaciones(res.data);
    } catch (error) {
      console.log("Error al obtener ubicaciones:", error);
    }
  };

  // Obtener una ubicación por su ID
  const getUbicacion = async (id) => {
    try {
      const res = await getUbicacionRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la ubicación:", error);
    }
  };

  // Crear una nueva ubicación
  const createUbicacion = async (ubicacion) => {
    try {
      const res = await createUbicacionRequest(ubicacion);
      if (res.status === 201) {
        setUbicaciones([...ubicaciones, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la ubicación:", error);
    }
  };

  // Actualizar una ubicación existente
  const updateUbicacion = async (id, ubicacion) => {
    try {
      const res = await updateUbicacionRequest(id, ubicacion);
      if (res.status === 200) {
        setUbicaciones(
          ubicaciones.map((u) => (u._id === id ? { ...u, ...res.data } : u))
        );
      }
    } catch (error) {
      console.log("Error al actualizar la ubicación:", error);
    }
  };

  // Eliminar una ubicación
  const deleteUbicacion = async (id) => {
    try {
      const res = await deleteUbicacionRequest(id);
      if (res.status === 204) {
        setUbicaciones(ubicaciones.filter((ubicacion) => ubicacion._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la ubicación:", error);
    }
  };

  return (
    <UbicacionContext.Provider
      value={{
        ubicaciones,
        getUbicaciones,
        getUbicacion,
        createUbicacion,
        updateUbicacion,
        deleteUbicacion,
      }}
    >
      {children}
    </UbicacionContext.Provider>
  );
}