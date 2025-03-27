import axios from "./axios";

// Peticiones relacionadas con categorías
export const getCategoriasRequest = () => axios.get("/categories");

export const getCategoriaRequest = (id) => axios.get(`/categories/${id}`);

export const createCategoriaRequest = (categoria) => axios.post("/categories", categoria);

export const updateCategoriaRequest = (id, categoria) => axios.put(`/categories/${id}`, categoria);

export const deleteCategoriaRequest = (id) => axios.delete(`/categories/${id}`);

