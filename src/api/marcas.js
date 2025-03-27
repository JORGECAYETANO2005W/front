import axios from "./axios";

// Peticiones relacionadas con marcas
export const getMarcasRequest = () => axios.get("/marcas");

export const getMarcaRequest = (id) => axios.get(`/marcas/${id}`);

export const createMarcaRequest = (marca) => axios.post("/marcas", marca);

export const updateMarcaRequest = (id, marca) => axios.put(`/marcas/${id}`, marca);

export const deleteMarcaRequest = (id) => axios.delete(`/marcas/${id}`);

