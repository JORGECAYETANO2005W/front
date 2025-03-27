import { createContext, useContext, useState } from "react";
import {
  getContactosRequest,
  getContactoRequest,
  createContactoRequest,
  updateContactoRequest,
  deleteContactoRequest,
} from "../api/contacto";

const ContactoContext = createContext();

export const useContactos = () => {
  const context = useContext(ContactoContext);
  if (!context) {
    throw new Error("useContactos must be used within a ContactoProvider");
  }
  return context;
};

export function ContactoProvider({ children }) {
  const [contactos, setContactos] = useState([]);

  // Obtener todos los contactos
  const getContactos = async () => {
    try {
      const res = await getContactosRequest();
      setContactos(res.data);
    } catch (error) {
      console.error("Error al obtener contactos:", error);
    }
  };

  // Obtener un contacto por su ID
  const getContacto = async (id) => {
    try {
      const res = await getContactoRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener el contacto:", error);
    }
  };

  // Crear un nuevo contacto
  const createContacto = async (contacto) => {
    try {
      const res = await createContactoRequest(contacto);
      if (res.status === 201) {
        setContactos([...contactos, res.data]);
      }
    } catch (error) {
      console.error("Error al crear el contacto:", error);
    }
  };

  // Actualizar un contacto existente
  const updateContacto = async (id, contacto) => {
    try {
      const res = await updateContactoRequest(id, contacto);
      if (res.status === 200) {
        setContactos(
          contactos.map((c) => (c._id === id ? { ...c, ...res.data } : c))
        );
      }
    } catch (error) {
      console.error("Error al actualizar el contacto:", error);
    }
  };

  // Eliminar un contacto
  const deleteContacto = async (id) => {
    try {
      const res = await deleteContactoRequest(id);
      if (res.status === 204) {
        setContactos(contactos.filter((contacto) => contacto._id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
    }
  };

  return (
    <ContactoContext.Provider
      value={{
        contactos,
        getContactos,
        getContacto,
        createContacto,
        updateContacto,
        deleteContacto,
      }}
    >
      {children}
    </ContactoContext.Provider>
  );
}

