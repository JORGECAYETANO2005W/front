import { createContext, useContext, useState } from "react";
import {
  getRedesSocialesRequest,
  getRedSocialRequest,
  createRedSocialRequest,
  updateRedSocialRequest,
  deleteRedSocialRequest,
} from "../api/redesSociales"; 

const RedesSocialesContext = createContext();

export const useRedesSociales = () => {
  const context = useContext(RedesSocialesContext);
  if (!context) {
    throw new Error("useRedesSociales must be used within a RedesSocialesProvider");
  }
  return context;
};

export function RedesSocialesProvider({ children }) {
  const [redesSociales, setRedesSociales] = useState([]);

  // Obtener todas las redes sociales
  const getRedesSociales = async () => {
    try {
      const res = await getRedesSocialesRequest();
      setRedesSociales(res.data);
    } catch (error) {
      console.log("Error al obtener redes sociales:", error);
    }
  };

  // Obtener una red social por su ID
  const getRedSocial = async (id) => {
    try {
      const res = await getRedSocialRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la red social:", error);
    }
  };

  // Crear una nueva red social
  const createRedSocial = async (redSocial) => {
    try {
      const res = await createRedSocialRequest(redSocial);
      if (res.status === 201) {
        setRedesSociales([...redesSociales, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la red social:", error);
    }
  };

  // Actualizar una red social existente
  const updateRedSocial = async (id, redSocial) => {
    try {
      const res = await updateRedSocialRequest(id, redSocial);
      if (res.status === 200) {
        setRedesSociales(
          redesSociales.map((rs) => (rs._id === id ? { ...rs, ...res.data } : rs))
        );
      }
    } catch (error) {
      console.log("Error al actualizar la red social:", error);
    }
  };

  // Eliminar una red social
  const deleteRedSocial = async (id) => {
    try {
      const res = await deleteRedSocialRequest(id);
      if (res.status === 204) {
        setRedesSociales(redesSociales.filter((rs) => rs._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la red social:", error);
    }
  };

  return (
    <RedesSocialesContext.Provider
      value={{
        redesSociales,
        getRedesSociales,
        getRedSocial,
        createRedSocial,
        updateRedSocial,
        deleteRedSocial,
      }}
    >
      {children}
    </RedesSocialesContext.Provider>
  );
}

