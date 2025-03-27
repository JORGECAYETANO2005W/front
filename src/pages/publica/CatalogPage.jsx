import React, { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import ProductsGrid from "./ProductsGrid";
import Pagination from "./Pagination";
import "../../styles/products.css";

function CatalogPage() {
  const { getProducts, products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    getProducts();
  }, []);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="catalog-container">
        <h1 className="catalog-title">Productos</h1>
        <div className="catalog-loading">Cargando productos...</div>
      </div>
    );
  }

  // Si no hay productos
  if (!products || products.length === 0) {
    return (
      <div className="catalog-container">
        <h1 className="catalog-title">Productos</h1>
        <h2 className="catalog-empty">No hay productos disponibles</h2>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">Productos</h1>
      <ProductsGrid products={currentProducts} />
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        currentPage={currentPage}
        paginate={paginate}
        indexOfFirstProduct={indexOfFirstProduct}
        indexOfLastProduct={indexOfLastProduct}
      />

    </div>
  );
}

export default CatalogPage;

