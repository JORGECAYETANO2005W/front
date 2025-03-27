import { createContext, useContext, useState } from "react";
import {
  getMarcasRequest,
  getMarcaRequest,
  createMarcaRequest,
  updateMarcaRequest,
  deleteMarcaRequest,
} from "../api/marcas";

const MarcaContext = createContext();

export const useMarcas = () => {
  const context = useContext(MarcaContext);
  if (!context) {
    throw new Error("useMarcas must be used within a MarcaProvider");
  }
  return context;
};

export function MarcaProvider({ children }) {
  const [marcas, setMarcas] = useState([]);

  // Obtener todas las marcas
  const getMarcas = async () => {
    try {
      const res = await getMarcasRequest();
      setMarcas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener una marca por su ID
  const getMarca = async (id) => {
    try {
      const res = await getMarcaRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Crear una nueva marca
  const createMarca = async (marca) => {
    try {
      const res = await createMarcaRequest(marca);
      if (res.status === 201) {
        setMarcas([...marcas, res.data]); // Agregar la nueva marca al estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Actualizar una marca existente
  const updateMarca = async (id, marca) => {
    try {
      const res = await updateMarcaRequest(id, marca);
      if (res.status === 200) {
        setMarcas(
          marcas.map((m) => (m._id === id ? { ...m, ...res.data } : m))
        ); // Actualizar la marca en el estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar una marca
  const deleteMarca = async (id) => {
    try {
      const res = await deleteMarcaRequest(id);
      if (res.status === 204) {
        setMarcas(marcas.filter((marca) => marca._id !== id)); // Eliminar la marca del estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MarcaContext.Provider
      value={{
        marcas,
        getMarcas,
        getMarca,
        createMarca,
        updateMarca,
        deleteMarca,
      }}
    >
      {children}
    </MarcaContext.Provider>
  );
}