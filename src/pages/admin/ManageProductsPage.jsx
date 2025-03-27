import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import '../../styles/tableProducts.css';
import ProductDetailsModal from "../../components/ProductDetailsModal";
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaBox, FaTags, FaTrademark } from 'react-icons/fa';
import { MdAttachMoney, MdOutlineRateReview } from 'react-icons/md';

function ProductTable() {
  const { products, deleteProduct, getProducts } = useProducts();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProducts();
        setError(null);
      } catch (err) {
        setError("Hubo un error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && typeof product.category === "object" && product.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.marca && typeof product.marca === "object" && product.marca.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="vet-admin-loading-container">
        <div className="vet-admin-loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vet-admin-error-container">
        <p>Error: {error}</p>
        <button className="vet-admin-retry-btn" onClick={() => getProducts()}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="vet-admin-empty-state">
        <FaBox size={40} />
        <p>No hay productos disponibles</p>
        <Link to="/products/create" className="vet-admin-create-btn">
          <FaPlus /> Crear Producto
        </Link>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        await deleteProduct(id);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="vet-admin-table-container">
      <div className="vet-admin-table-header">
        <h2 className="vet-admin-table-title">Gestión de Productos</h2>
        
        <div className="vet-admin-search-container">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={handleSearch}
            className="vet-admin-search-input"
          />
        </div>
        <Link to="/products/create" className="vet-admin-create-btn">
          <FaPlus /> Crear Producto
        </Link>
      </div>

      <div className="vet-admin-table-responsive">
        <table className="vet-admin-table">
          <thead>
            <tr>
              <th><span className="vet-admin-th-content"><FaBox /> Nombre</span></th>
              <th><span className="vet-admin-th-content"><MdAttachMoney /> Precio</span></th>
              <th><span className="vet-admin-th-content"><FaBox /> Stock</span></th>
              <th><span className="vet-admin-th-content"><FaTags /> Categoría</span></th>
              <th><span className="vet-admin-th-content"><FaTrademark /> Marca</span></th>
              <th><span className="vet-admin-th-content"><FaStar /> Valoración</span></th>
              <th><span className="vet-admin-th-content"><MdOutlineRateReview /> Reseñas</span></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td className="vet-admin-price-column">${product.price.toFixed(2)}</td>
                <td className="vet-admin-stock-column">{product.stock}</td>
                <td>
                  {product.category
                    ? (typeof product.category === "object" && product.category.name
                      ? product.category.name
                      : "No especificada")
                    : "No especificada"}
                </td>
                <td>
                  {product.marca
                    ? (typeof product.marca === "object" && product.marca.name
                      ? product.marca.name
                      : "No especificada")
                    : "No especificada"}
                </td>
                <td className="vet-admin-rating-column">
                  {product.rating || 0} <FaStar className="vet-admin-star-icon" />
                </td>
                <td className="vet-admin-reviews-column">{product.reviews ? product.reviews.length : 0}</td>
                <td className="vet-admin-product-actions">
                  <button
                    className="vet-admin-view-btn"
                    onClick={() => openModal(product)}
                    title="Ver detalles"
                  >
                    <FaEye />
                  </button>
                  <Link
                    to={`/products/update/${product._id}`}
                    className="vet-admin-update-btn"
                    title="Actualizar producto"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="vet-admin-delete-btn"
                    onClick={() => handleDelete(product._id)}
                    title="Eliminar producto"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && selectedProduct && (
        <div className="vet-admin-modal-backdrop">
          <div className="vet-admin-modal-content">
            <ProductDetailsModal 
              product={selectedProduct} 
              onClose={() => setShowModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;