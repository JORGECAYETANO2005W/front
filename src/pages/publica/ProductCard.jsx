import React from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaStar, FaStarHalf, FaRegStar, FaShoppingCart } from "react-icons/fa";

function ProductCard({ product }) {
    if (!product) {
        return <div className="catalog-loading">Cargando...</div>;
    }

    const { _id, name, price, stock, images, category, rating = 0, reviews = [], discount = 0, isNew = false, isBestseller = false } = product;
    const firstImage = images && images.length > 0 ? images[0] : 'default-image.jpg';
    
    // Calcular precio original solo si hay descuento
    const hasDiscount = discount > 0;
    const originalPrice = hasDiscount ? price / (1 - discount / 100) : null;
    
    // Determinar tipo de badge basado en propiedades del producto
    let badgeType = null;
    let badgeText = "";
    
    if (isNew) {
        badgeType = "new";
        badgeText = "Nuevo";
    } else if (isBestseller) {
        badgeType = "bestseller";
        badgeText = "Más Vendido";
    }
    
    // Renderizar estrellas para calificación
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} />);
            } else if (i === fullStars + 1 && halfStar) {
                stars.push(<FaStarHalf key={i} />);
            } else {
                stars.push(<FaRegStar key={i} />);
            }
        }
        
        return stars;
    };

    return (
        <div className="vet-product-card">
            {/* Badge para productos destacados (solo si hay badge) */}
            {badgeType && (
                <div className={`vet-product-badge ${badgeType}`}>
                    {badgeText}
                </div>
            )}
            
            {/* Botón de favoritos
            
            <button className="vet-wishlist-btn">
                <FaRegHeart className="vet-heart-icon" />
            </button>
            
            */}
            
            
            {/* Contenedor de imagen con altura fija */}
            <div className="vet-product-image-container">
                <img
                    src={firstImage}
                    alt={name}
                    className="vet-product-image"
                />
            </div>
            
            {/* Información del producto */}
            <div className="vet-product-info">
                {/* Categoría */}
                {category && (
                    <div className="vet-product-category">
                        {category.name || "Categoría"}
                    </div>
                )}
                
                {/* Título */}
                <h2 className="vet-product-title">{name}</h2>
                
                {/* Calificación */}
                <div className="vet-product-rating">
                    <div className="vet-rating-stars">
                        {renderStars(rating)}
                    </div>
                    <span className="vet-rating-count">
                        ({reviews?.length || 0})
                    </span>
                </div>
                
                {/* Precio */}
                <div className="vet-product-price-container">
                    <span className="vet-product-price">${price.toFixed(2)}</span>
                    {hasDiscount && (
                        <>
                            <span className="vet-product-price-original">
                                ${originalPrice.toFixed(2)}
                            </span>
                            <span className="vet-product-discount">
                                -{discount}%
                            </span>
                        </>
                    )}
                </div>
                
                {/* Disponibilidad (stock bajo o agotado) */}
                {stock === 0 ? (
                    <div className="vet-product-stock low">
                        Agotado
                    </div>
                ) : stock <= 5 ? (
                    <div className="vet-product-stock low">
                        ¡Solo {stock} unidades!
                    </div>
                ) : null}
                
                {/* Botones de acción */}
                <div className="vet-product-actions">
                    <Link to={`/products/${_id}`} className="vet-view-more-btn">
                        Ver detalles
                    </Link>
                    <button className="vet-add-cart-btn" disabled={stock === 0}>
                        <FaShoppingCart />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;

