import axios from "./axios";

// Peticiones relacionadas con políticas
export const getPoliticasRequest = () => axios.get("/politicas");

export const getPoliticaRequest = (id) => axios.get(`/politicas/${id}`);

export const createPoliticaRequest = (politica) => axios.post("/politicas", politica);

export const updatePoliticaRequest = (id, politica) => axios.put(`/politicas/${id}`, politica);

export const deletePoliticaRequest = (id) => axios.delete(`/politicas/${id}`);

