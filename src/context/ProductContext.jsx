import { createContext, useContext, useState } from "react";
import {
  getProductsRequest,
  getProductRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  addReviewRequest,
} from "../api/products";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener todos los productos
  const getProducts = async () => {
    try {
      const res = await getProductsRequest();
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener un producto por su ID
  const getProduct = async (id) => {
    try {
      const res = await getProductRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createProduct = async (product) => {
    try {
      console.log("Producto a enviar:", product); // 🔍 Verifica qué se está enviando
      const res = await createProductRequest(product);
      console.log("Respuesta del servidor:", res.data); // 🔍 Verifica la respuesta del backend
      if (res.status === 201) {
        setProducts([...products, res.data]);
      }
    } catch (error) {
      console.log("Error al crear el producto:", error.response?.data || error);
    }
  };


  // Actualizar un producto existente
  const updateProduct = async (id, product) => {
    try {
      const res = await updateProductRequest(id, product);
      if (res.status === 200) {
        setProducts(
          products.map((p) => (p._id === id ? { ...p, ...res.data } : p))
        ); // Actualizar el producto en el estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addReview = async (id, review) => {
    try {
      const res = await addReviewRequest(id, review);
      if (res.status === 200) {
        // Actualizar el producto en el estado con la nueva reseña
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id
              ? { ...product, reviews: [...product.reviews, res.data] }
              : product
          )
        );
      }
    } catch (error) {
      console.log("Error al agregar la reseña:", error.response?.data || error);
    }
  };


  // Eliminar un producto
  const deleteProduct = async (id) => {
    try {
      const res = await deleteProductRequest(id);
      if (res.status === 204) {
        setProducts(products.filter((product) => product._id !== id)); // Eliminar el producto del estado
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const getProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const res = await getProductsRequest();
      
      const filteredProducts = res.data.filter(product => {

        if (product.category && typeof product.category === 'object' && product.category._id) {
          return product.category._id === categoryId;
        }
   
        else if (product.category === categoryId) {
          return true;
        }
  
        else if (Array.isArray(product.categories)) {
          return product.categories.some(cat => 
            (typeof cat === 'object' && cat._id === categoryId) || cat === categoryId
          );
        }
        return false;
      });
      
      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  return (
    <ProductContext.Provider
      value={{
        products,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        addReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

