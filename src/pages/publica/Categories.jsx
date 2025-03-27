import React, { useEffect, useState } from "react";
import { useCategories } from "../../context/CategoryContext";
import { useProducts } from "../../context/ProductContext";
import ProductsGrid from "./ProductsGrid";
import Pagination from "./Pagination";
import "../../styles/products.css";

function Categories() {
  const { categories, getCategories } = useCategories();
  const { getProducts, products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      if (selectedCategory) {
        // Filter products by selected category
        const filtered = products.filter(product => product.category === selectedCategory._id);
        setFilteredProducts(filtered);
      } else {
        // If no category is selected, show all products
        setFilteredProducts(products);
      }
      setCurrentPage(1); // Reset to first page when changing categories
    }
  }, [selectedCategory, products]);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Handle showing all products
  const handleShowAllProducts = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="catalog-container">
        <h1 className="catalog-title">Catálogo de Productos</h1>
        <div className="catalog-loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">Categorías</h1>
      
      <div className="categories-container">
        <button 
          className={`category-button ${selectedCategory === null ? 'active' : ''}`}
          onClick={handleShowAllProducts}
        >
          Todas las Categorías
        </button>
        
        {categories.map((category) => (
          <button
            key={category._id}
            className={`category-button ${selectedCategory && selectedCategory._id === category._id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <h2 className="category-title">
        {selectedCategory ? `Productos de ${selectedCategory.name}` : 'Todos los Productos'}
      </h2>

      {filteredProducts.length === 0 ? (
        <h3 className="catalog-empty">No hay productos disponibles en esta categoría</h3>
      ) : (
        <>
          <ProductsGrid products={currentProducts} />
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={filteredProducts.length}
            currentPage={currentPage}
            paginate={paginate}
            indexOfFirstProduct={indexOfFirstProduct}
            indexOfLastProduct={indexOfLastProduct}
          />
        </>
      )}
    </div>
  );
}

export default Categories;