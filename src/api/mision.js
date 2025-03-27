import axios from "./axios";

// Peticiones relacionadas con misiones
export const getMisionesRequest = () => axios.get("/misiones");

export const getMisionRequest = (id) => axios.get(`/misiones/${id}`);

export const createMisionRequest = (mision) => axios.post("/misiones", mision);

export const updateMisionRequest = (id, mision) => axios.put(`/misiones/${id}`, mision);

export const deleteMisionRequest = (id) => axios.delete(`/misiones/${id}`);
