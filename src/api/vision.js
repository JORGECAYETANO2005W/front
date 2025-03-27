import axios from "./axios";

// Peticiones relacionadas con visiones
export const getVisionesRequest = () => axios.get("/visiones");

export const getVisionRequest = (id) => axios.get(`/visiones/${id}`);

export const createVisionRequest = (vision) => axios.post("/visiones", vision);

export const updateVisionRequest = (id, vision) => axios.put(`/visiones/${id}`, vision);

export const deleteVisionRequest = (id) => axios.delete(`/visiones/${id}`);

