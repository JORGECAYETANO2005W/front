import axios from "./axios";

// Peticiones relacionadas con productos
export const getProductsRequest = () => axios.get("/products");

export const getProductRequest = (id) => axios.get(`/products/${id}`);

export const createProductRequest = (product) => axios.post("/products", product);

export const updateProductRequest = (id, product) => axios.put(`/products/${id}`, product);

export const deleteProductRequest = (id) => axios.delete(`/products/${id}`);

export const addReviewRequest = (id, review) => axios.post(`/products/${id}/reviews`, review);

