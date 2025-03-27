import { createContext, useContext, useState } from "react";
import {
  getFAQsRequest,
  getFAQRequest,
  createFAQRequest,
  updateFAQRequest,
  deleteFAQRequest,
} from "../api/preguntasFre"; 

const FAQContext = createContext();

export const useFAQs = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error("useFAQs must be used within a FAQProvider");
  }
  return context;
};

export function FAQProvider({ children }) {
  const [faqs, setFAQs] = useState([]);

  // Obtener todas las FAQs
  const getFAQs = async () => {
    try {
      const res = await getFAQsRequest();
      setFAQs(res.data);
    } catch (error) {
      console.log("Error al obtener las FAQs:", error);
    }
  };

  // Obtener una FAQ por su ID
  const getFAQ = async (id) => {
    try {
      const res = await getFAQRequest(id);
      return res.data;
    } catch (error) {
      console.log("Error al obtener la FAQ:", error);
    }
  };

  // Crear una nueva FAQ
  const createFAQ = async (faq) => {
    try {
      const res = await createFAQRequest(faq);
      if (res.status === 201) {
        setFAQs([...faqs, res.data]);
      }
    } catch (error) {
      console.log("Error al crear la FAQ:", error);
    }
  };

  // Actualizar una FAQ existente
  const updateFAQ = async (id, faq) => {
    try {
      const res = await updateFAQRequest(id, faq);
      if (res.status === 200) {
        setFAQs(faqs.map((f) => (f._id === id ? { ...f, ...res.data } : f)));
      }
    } catch (error) {
      console.log("Error al actualizar la FAQ:", error);
    }
  };

  // Eliminar una FAQ
  const deleteFAQ = async (id) => {
    try {
      const res = await deleteFAQRequest(id);
      if (res.status === 204) {
        setFAQs(faqs.filter((faq) => faq._id !== id));
      }
    } catch (error) {
      console.log("Error al eliminar la FAQ:", error);
    }
  };

  return (
    <FAQContext.Provider
      value={{
        faqs,
        getFAQs,
        getFAQ,
        createFAQ,
        updateFAQ,
        deleteFAQ,
      }}
    >
      {children}
    </FAQContext.Provider>
  );
}

