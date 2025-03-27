import { createContext, useContext, useState } from "react";
import {
  getCategoriasRequest,
  getCategoriaRequest,
  createCategoriaRequest,
  updateCategoriaRequest,
  deleteCategoriaRequest,
} from "../api/categories";

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);

  // Obtener todas las categorías
  const getCategories = async () => {
    try {
      const res = await getCategoriasRequest();
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener una categoría por su ID
  const getCategory = async (id) => {
    try {
      const res = await getCategoriaRequest(id);
     
    } catch (error) {
      console.log(error);
    }
  };

  // Crear una nueva categoría
  const createCategory = async (category) => {
    try {
      const res = await createCategoriaRequest(category);
      if (res.status === 201) {
        setCategories([...categories, res.data]); // Agregar la nueva categoría al estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Actualizar una categoría existente
  const updateCategory = async (id, category) => {
    try {
      const res = await updateCategoriaRequest(id, category);
      if (res.status === 200) {
        setCategories(
          categories.map((cat) => (cat._id === id ? { ...cat, ...res.data } : cat))
        ); // Actualizar la categoría en el estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar una categoría
  const deleteCategory = async (id) => {
    try {
      const res = await deleteCategoriaRequest(id);
      if (res.status === 204) {
        setCategories(categories.filter((category) => category._id !== id)); // Eliminar la categoría del estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        getCategories,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

