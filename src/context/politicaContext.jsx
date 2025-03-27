import { createContext, useContext, useState } from "react";
import {
  getPoliticasRequest,
  getPoliticaRequest,
  createPoliticaRequest,
  updatePoliticaRequest,
  deletePoliticaRequest,
} from "../api/politica"; // Importar las funciones de la API

const PoliticaContext = createContext();

export const usePoliticas = () => {
  const context = useContext(PoliticaContext);
  if (!context) {
    throw new Error("usePoliticas must be used within a PoliticaProvider");
  }
  return context;
};

export function PoliticaProvider({ children }) {
  const [politicas, setPoliticas] = useState([]);

  // Obtener todas las políticas
  const getPoliticas = async () => {
    try {
      const res = await getPoliticasRequest();
      setPoliticas(res.data);
    } catch (error) {
      console.log("Error al obtener políticas:", error);
    }
  };

  // Obtener una política por su ID
  const getPolitica = async (id) => {
    try {
      const res = await getPoliticaRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la política:", error);
    }
  };

  // Crear una nueva política
  const createPolitica = async (politica) => {
    try {
      const res = await createPoliticaRequest(politica);
      if (res.status === 201) {
        setPoliticas([...politicas, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la política:", error);
    }
  };

  // Actualizar una política existente
  const updatePolitica = async (id, politica) => {
    try {
      const res = await updatePoliticaRequest(id, politica);
      if (res.status === 200) {
        setPoliticas(
          politicas.map((p) => (p._id === id ? { ...p, ...res.data } : p))
        );
      }
    } catch (error) {
      console.log("Error al actualizar la política:", error);
    }
  };

  // Eliminar una política
  const deletePolitica = async (id) => {
    try {
      const res = await deletePoliticaRequest(id);
      if (res.status === 204) {
        setPoliticas(politicas.filter((politica) => politica._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la política:", error);
    }
  };

  return (
    <PoliticaContext.Provider
      value={{
        politicas,
        getPoliticas,
        getPolitica,
        createPolitica,
        updatePolitica,
        deletePolitica,
      }}
    >
      {children}
    </PoliticaContext.Provider>
  );
}

