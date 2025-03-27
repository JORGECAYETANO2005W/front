import axios from "./axios";

// Peticiones relacionadas con contactos
export const getContactosRequest = () => axios.get("/contactos");

export const getContactoRequest = (id) => axios.get(`/contactos/${id}`);

export const createContactoRequest = (contacto) => axios.post("/contactos", contacto);

export const updateContactoRequest = (id, contacto) => axios.put(`/contactos/${id}`, contacto);

export const deleteContactoRequest = (id) => axios.delete(`/contactos/${id}`);

export const addRedSocialRequest = (id, redSocial) =>
    axios.post(`/contactos/${id}/redes-sociales`, redSocial);

