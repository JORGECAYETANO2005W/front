import React, { useState } from 'react';
import { FaTimes, FaStar, FaBox, FaTags, FaTrademark, FaCalendarAlt, FaInfoCircle, FaUser, FaImages } from 'react-icons/fa';
import { MdAttachMoney, MdOutlineRateReview } from 'react-icons/md';
import '../styles/productDetailsModal.css';

function ProductDetailsModal({ product, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Verifica si hay imágenes disponibles
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="vet-admin-modal-overlay">
      <div className="vet-admin-modal-content">
        <div className="vet-admin-modal-header">
          <h2 className="vet-admin-modal-title">Detalles del Producto</h2>
          <button className="vet-admin-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="vet-admin-modal-body">
          {/* Información principal */}
          <div className="vet-admin-product-main-info">
            <h3 className="vet-admin-product-name">{product.name}</h3>
            
            {/* Galería de imágenes */}
            {hasImages && (
              <div className="vet-admin-product-gallery">
                <div className="vet-admin-main-image-container">
                  <img 
                    src={product.images[activeImageIndex]} 
                    alt={`${product.name} - Imagen ${activeImageIndex + 1}`} 
                    className="vet-admin-product-main-image" 
                  />
                </div>
                
                {product.images.length > 1 && (
                  <div className="vet-admin-image-thumbnails">
                    {product.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`vet-admin-image-thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Descripción */}
          {product.description && (
            <div className="vet-admin-product-description">
              <h4 className="vet-admin-description-title"><FaInfoCircle /> Descripción</h4>
              <p className="vet-admin-description-content">{product.description}</p>
            </div>
          )}
          
          <div className="vet-admin-product-details-grid">
            {/* Columna izquierda */}
            <div className="vet-admin-details-column">
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><MdAttachMoney /> Precio:</div>
                <div className="vet-admin-detail-value">${product.price.toFixed(2)}</div>
              </div>
              
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><FaBox /> Stock:</div>
                <div className="vet-admin-detail-value">{product.stock}</div>
              </div>
              
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><FaTags /> Categoría:</div>
                <div className="vet-admin-detail-value">
                  {product.category
                    ? (typeof product.category === "object" && product.category.name
                      ? product.category.name
                      : "No especificada")
                    : "No especificada"}
                </div>
              </div>
              
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><FaTrademark /> Marca:</div>
                <div className="vet-admin-detail-value">
                  {product.marca
                    ? (typeof product.marca === "object" && product.marca.name
                      ? product.marca.name
                      : "No especificada")
                    : "No especificada"}
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="vet-admin-details-column">
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><FaStar /> Valoración:</div>
                <div className="vet-admin-detail-value vet-admin-rating-display">
                  {product.rating || 0} <FaStar className="vet-admin-star-icon" />
                </div>
              </div>
              
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><MdOutlineRateReview /> Reseñas:</div>
                <div className="vet-admin-detail-value">{product.reviews ? product.reviews.length : 0}</div>
              </div>
              
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><FaUser /> Creado por:</div>
                <div className="vet-admin-detail-value">
                  {product.user
                    ? (typeof product.user === "object" && product.user.name
                      ? product.user.name
                      : product.user._id || "No especificado")
                    : "No especificado"}
                </div>
              </div>
              
              <div className="vet-admin-detail-item">
                <div className="vet-admin-detail-label"><FaImages /> Imágenes:</div>
                <div className="vet-admin-detail-value">
                  {hasImages ? product.images.length : 0}
                </div>
              </div>
            </div>
          </div>
          
          <div className="vet-admin-additional-details">
            <div className="vet-admin-detail-item wide">
              <div className="vet-admin-detail-label"><FaCalendarAlt /> Fecha de creación:</div>
              <div className="vet-admin-detail-value">{formatDate(product.createdAt)}</div>
            </div>
            
            <div className="vet-admin-detail-item wide">
              <div className="vet-admin-detail-label"><FaCalendarAlt /> Última actualización:</div>
              <div className="vet-admin-detail-value">{formatDate(product.updatedAt)}</div>
            </div>
          </div>
          
          {/* Reseñas si existen */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="vet-admin-product-reviews">
              <h4 className="vet-admin-reviews-title"><MdOutlineRateReview /> Reseñas de Clientes ({product.reviews.length})</h4>
              <div className="vet-admin-reviews-list">
                {product.reviews.map((review, index) => (
                  <div className="vet-admin-review-item" key={index}>
                    <div className="vet-admin-review-header">
                      <div className="vet-admin-reviewer-info">
                        <span className="vet-admin-reviewer-name">
                          {review.user && typeof review.user === "object" && review.user.name
                            ? review.user.name
                            : "Usuario"}
                        </span>
                        <span className="vet-admin-review-date">{formatDate(review.createdAt)}</span>
                      </div>
                      <span className="vet-admin-review-rating">
                        {review.rating || 0} <FaStar className="vet-admin-star-icon" />
                      </span>
                    </div>
                    <p className="vet-admin-review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="vet-admin-modal-footer">
          <button className="vet-admin-modal-close-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;

