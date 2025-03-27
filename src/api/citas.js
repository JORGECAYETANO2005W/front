import axios from "./axios";

// Peticiones relacionadas con citas
export const getCitasRequest = () => axios.get("/citas");

export const getCitaRequest = (id) => axios.get(`/citas/${id}`);

export const createCitaRequest = (cita) => axios.post("/citas", cita);

export const updateCitaRequest = (id, cita) => axios.put(`/citas/${id}`, cita);

export const deleteCitaRequest = (id) => axios.delete(`/citas/${id}`);

export const getCitasByUserRequest = async (userId) => {
  return await axios.get(`/citas/user/${userId}`);
};

