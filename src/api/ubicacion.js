import axios from "./axios"; // Importa la instancia configurada de axios

// Peticiones relacionadas con ubicaciones
export const getUbicacionesRequest = () => axios.get("/ubicaciones");

export const getUbicacionRequest = (id) => axios.get(`/ubicaciones/${id}`);

export const createUbicacionRequest = (ubicacion) => axios.post("/ubicaciones", ubicacion);

export const updateUbicacionRequest = (id, ubicacion) => axios.put(`/ubicaciones/${id}`, ubicacion);

export const deleteUbicacionRequest = (id) => axios.delete(`/ubicaciones/${id}`);

