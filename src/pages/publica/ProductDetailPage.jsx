import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/product.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { getProduct, addReview } = useProducts();
    const { user, getUser } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [reviewUsers, setReviewUsers] = useState({});
    const [hasUserReviewed, setHasUserReviewed] = useState(false);



    // Helper function to extract user ID from review
    const getUserIdFromReview = (review) => {
        if (typeof review.user === 'string') {
            return review.user;
        } else if (review.user && review.user.$oid) {
            return review.user.$oid;
        } else if (review.user && review.user._id) {
            return review.user._id;
        }
        return null;
    };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProduct(id);
                setProduct(productData);

                // Fetch user details for each review
                const users = {};
                for (const review of productData.reviews) {
                    try {
                        // Handle both object format and string ID format
                        const userId = typeof review.user === 'object' ? review.user.$oid || review.user._id : review.user;

                        // Only fetch user if userId is defined
                        if (userId) {
                            const userDetails = await getUser(userId);
                            if (userDetails) {
                                users[userId] = userDetails;
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching user details for review:', error);
                        // Continue with next review even if one fails
                    }
                }
                setReviewUsers(users);

                if (productData.images && productData.images.length > 0) {
                    setMainImage(productData.images[0]);
                }

                // Check if current user has already reviewed - IMPROVED CHECK
                if (user) {
                    const currentUserId = user._id;
                    // Use some() to check if any review matches the current user
                    const hasReviewed = productData.reviews.some(review => {
                        // Extract the user ID from different possible formats
                        const reviewUserId = getUserIdFromReview(review);
                        return reviewUserId === currentUserId;
                    });

                    setHasUserReviewed(hasReviewed);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Error al cargar el producto');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, getProduct, getUser, user]);


    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="star" />);
            } else if (i === fullStars + 1 && halfStar) {
                stars.push(<FaStarHalfAlt key={i} className="star" />);
            } else {
                stars.push(<FaRegStar key={i} className="star" />);
            }
        }

        return stars;
    };

    const handleRatingClick = (rating) => {
        setUserRating(rating);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.warning('Debe iniciar sesión para dejar una reseña');
            return;
        }

        if (hasUserReviewed) {
            toast.warning('Ya has dejado una reseña para este producto');
            return;
        }

        if (userRating === 0) {
            toast.warning('Por favor seleccione una calificación');
            return;
        }

        if (userComment.trim().length < 3) {
            toast.warning('Por favor escriba un comentario más descriptivo');
            return;
        }

        try {
            // Create new review object
            const newReview = {
                rating: userRating,
                comment: userComment,
            };

            // Add review using context function
            await addReview(id, newReview);

            // Refresh product with new review
            const refreshedProduct = await getProduct(id);
            setProduct(refreshedProduct);

            // Add the current user to reviewUsers without making another API call
            // since we already have the current user's information
            if (user && user._id) {
                setReviewUsers(prev => ({
                    ...prev,
                    [user._id]: user
                }));
            }

            // Set that the user has now reviewed
            setHasUserReviewed(true);

            // Reset form
            setUserRating(0);
            setUserComment('');

            toast.success('¡Gracias por su reseña!');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error al enviar la reseña. Por favor intente de nuevo.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return (
            <div className="product-detail-container">
                <div className="loading">Cargando producto...</div>
                <ToastContainer position="bottom-right" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-container">
                <div className="product-detail-card">
                    <h2>Producto no encontrado</h2>
                </div>
                <ToastContainer position="bottom-right" />
            </div>
        );
    }

    // Helper function to get display name for a reviewer
    const getReviewerDisplayName = (reviewUserId) => {
        const reviewer = reviewUsers[reviewUserId];
        if (reviewer && reviewer.realName) {
            return `${reviewer.realName} ${reviewer.lastName || ''}`.trim();
        }
        return 'Usuario';
    };

    // Helper function to get initials for avatar
    const getReviewerInitials = (reviewUserId) => {
        const reviewer = reviewUsers[reviewUserId];
        if (reviewer && reviewer.realName) {
            return `${reviewer.realName.charAt(0).toUpperCase()}${reviewer.lastName ? reviewer.lastName.charAt(0).toUpperCase() : ''}`;
        }
        return 'U';
    };

    return (
        <div className="product-detail-container txt">
            <ToastContainer position="bottom-right" />
            <div className="product-detail-card">
                <div className="product-main-section">
                    {/* Image section */}
                    <div className="product-images-container">
                        <img
                            src={mainImage || product.images[0] || '/placeholder-image.jpg'}
                            alt={product.name}
                            className="product-main-image"
                        />

                        {product.images && product.images.length > 1 && (
                            <div className="product-image-gallery">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} - imagen ${index + 1}`}
                                        className={`product-thumbnail ${mainImage === image ? 'active' : ''}`}
                                        onClick={() => handleImageClick(image)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Information section */}
                    <div className="product-info">
                        <h1 className="product-title h1-form">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {renderStars(product.rating)}
                            </div>
                            <span className="rating-count">
                                {product.reviews.length} {product.reviews.length === 1 ? 'reseña' : 'reseñas'}
                            </span>
                        </div>

                        <p className="product-description">{product.description}</p>

                        <div className="product-price">${product.price.toFixed(2)}</div>

                        <div className="product-stock">
                            <span className={`stock-indicator ${product.stock > 10 ? 'in-stock' :
                                product.stock > 0 ? 'low-stock' :
                                    'out-of-stock'
                                }`}></span>
                            {product.stock > 10
                                ? `En stock (${product.stock} disponibles)`
                                : product.stock > 0
                                    ? `¡Pocas unidades disponibles! (${product.stock})`
                                    : 'Agotado'
                            }
                        </div>

                        <div className="product-details">
                            {product.category && (
                                <span className="detail-item">
                                    Categoría: {product.category.name || 'Categoría'}
                                </span>
                            )}
                            {product.marca && (
                                <span className="detail-item">
                                    Marca: {product.marca.name || 'Marca'}
                                </span>
                            )}
                        </div>

                        <div className="button-group">
                            <button
                                className="cart-button txt"
                                disabled={product.stock === 0}
                                onClick={() => {
                                    // Add to cart function
                                    toast.success('Producto agregado al carrito');
                                }}
                            >
                                <FaShoppingCart /> Agregar al carrito
                            </button>
                            <button
                                className="buy-button txt"
                                disabled={product.stock === 0}
                                onClick={() => {
                                    // Buy now function
                                    toast.info('Redirigiendo al proceso de compra...');
                                }}
                            >
                                Comprar ahora
                            </button>
                        </div>
                    </div>
                </div>
              
                {/* Reviews section - visible to all users regardless of login status */}
                <div className="reviews-section">
                    <h2 className="reviews-title">Reseñas de clientes</h2>

                    <div className="reviews-list">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => {
                                const reviewUserId = getUserIdFromReview(review);

                                return (
                                    <div key={index} className="review-item">
                                        <div className="review-header">
                                            <div className="reviewer-info">
                                                <span className="reviewer-avatar">
                                                    {getReviewerInitials(reviewUserId)}
                                                </span>

                                                <span className="reviewer-name">
                                                    {getReviewerDisplayName(reviewUserId)}
                                                </span>
                                            </div>
                                            <span className="review-date">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                        <div className="review-rating">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-reviews">
                                <p>Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>
                            </div>
                        )}
                    </div>

                    {/* Review form - shows different content based on user login and review status */}
                    <div className="write-review">
                        <h3 className="write-review-title">Escribir una reseña</h3>
                        {!user ? (
                            <div className="login-prompt">
                                <p className='resen-init'>Debe iniciar sesión para dejar una reseña.</p>
                                <button className="login-button">Iniciar sesión</button>
                            </div>
                        ) : hasUserReviewed ? (
                            <div className="already-reviewed-message">
                                <p>Ya has dejado una reseña para este producto. ¡Gracias por compartir tu opinión!</p>
                            </div>
                        ) : (
                            <form className="review-form" onSubmit={handleSubmitReview}>
                                <div className="rating-selection">
                                    <label>Su calificación:</label>
                                    <div className="rating-input">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`rating-star ${userRating >= star ? 'active' : ''}`}
                                                onClick={() => handleRatingClick(star)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="comment-field">
                                    <label htmlFor="review-comment">Su comentario:</label>
                                    <textarea
                                        id="review-comment"
                                        className="comment-input"
                                        placeholder="Comparta su opinión sobre este producto..."
                                        value={userComment}
                                        onChange={(e) => setUserComment(e.target.value)}
                                        required
                                        minLength={3}
                                    />
                                </div>
                                <button type="submit" className="submit-review">
                                    Enviar reseña
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

