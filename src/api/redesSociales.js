import axios from "./axios"; // Importa la instancia configurada de axios

// Peticiones relacionadas con redes sociales
export const getRedesSocialesRequest = () => axios.get("/redes-sociales");

export const getRedSocialRequest = (id) => axios.get(`/redes-sociales/${id}`);

export const createRedSocialRequest = (redSocial) => axios.post("/redes-sociales", redSocial);

export const updateRedSocialRequest = (id, redSocial) => axios.put(`/redes-sociales/${id}`, redSocial);

export const deleteRedSocialRequest = (id) => axios.delete(`/redes-sociales/${id}`);

