import axios from "./axios";

export const getFAQsRequest = () => axios.get("/faqs");

export const getFAQRequest = (id) => axios.get(`/faqs/${id}`);

export const createFAQRequest = (faq) => axios.post("/faqs", faq);

export const updateFAQRequest = (id, faq) => axios.put(`/faqs/${id}`, faq);

export const deleteFAQRequest = (id) => axios.delete(`/faqs/${id}`);

