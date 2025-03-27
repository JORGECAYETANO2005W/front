import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext";
import { useMarcas } from "../../context/MarcaContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBox, FaFileAlt, FaTag, FaWarehouse, FaLayerGroup, FaTrademark, FaImage, FaTrash } from "react-icons/fa";
import "../../styles/productForm.css"; 

function UpdateProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProduct, updateProduct, deleteProduct } = useProducts();
    const { categories, getCategories } = useCategories();
    const { marcas, getMarcas } = useMarcas();
    
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        marca: "",
        images: ["", "", "", ""],
    });

    const [deleteConfirm, setDeleteConfirm] = useState(false);
   
    // Cargar el producto específico solo si el id existe (modo actualización)
    useEffect(() => {
        if (id) {
            const loadProduct = async () => {
                try {
                    const data = await getProduct(id);
                    setProduct(data);
                } catch (error) {
                    console.error(error);
                    toast.error("Error al cargar el producto");
                }
            };
            loadProduct();
        }
    }, [id, getProduct]);

    // Cargar categorías y marcas desde el contexto
    useEffect(() => {
        getCategories();
        getMarcas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "images") {
            const index = parseInt(e.target.dataset.index);
            const updatedImages = [...product.images];
            updatedImages[index] = value;
            setProduct({
                ...product,
                images: updatedImages,
            });
        } else {
            setProduct({
                ...product,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateProduct(id, product);
                toast.success("Producto actualizado con éxito!");
            }
            navigate('/manage-products');
        } catch (error) {
            toast.error("Hubo un error al procesar la solicitud.");
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            if (id) {
                await deleteProduct(id);
                toast.success("Producto eliminado con éxito!");
                navigate('/manage-products');
            }
        } catch (error) {
            toast.error("Hubo un error al eliminar el producto.");
            console.error(error);
        }
    };

    return (
        <div className="update-product-container">
            <div className="update-product-box">
                <h2 className="update-product-title">Actualizar Producto</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="update-product-input-group">
                        <label className="update-product-label">Nombre del Producto</label>
                        <div className="update-product-input-with-icon">
                            <div className="update-product-input-icon">
                                <FaBox />
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre del producto"
                                value={product.name}
                                onChange={handleChange}
                                className="update-product-input-field"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="update-product-input-group update-product-full-width">
                        <label className="update-product-label">Descripción</label>
                        <div className="update-product-input-with-icon">
                            <div className="update-product-input-icon">
                                <FaFileAlt />
                            </div>
                            <textarea
                                name="description"
                                placeholder="Descripción detallada del producto"
                                value={product.description}
                                onChange={handleChange}
                                className="update-product-input-field"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="update-product-input-group">
                        <label className="update-product-label">Precio</label>
                        <div className="update-product-input-with-icon">
                            <div className="update-product-input-icon">
                                <FaTag />
                            </div>
                            <input
                                type="number"
                                name="price"
                                placeholder="Precio"
                                value={product.price}
                                onChange={handleChange}
                                className="update-product-input-field"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="update-product-input-group">
                        <label className="update-product-label">Stock Disponible</label>
                        <div className="update-product-input-with-icon">
                            <div className="update-product-input-icon">
                                <FaWarehouse />
                            </div>
                            <input
                                type="number"
                                name="stock"
                                placeholder="Cantidad en stock"
                                value={product.stock}
                                onChange={handleChange}
                                className="update-product-input-field"
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="update-product-input-group">
                        <label className="update-product-label">Categoría</label>
                        <div className="update-product-input-with-icon">
                            <div className="update-product-input-icon">
                                <FaLayerGroup />
                            </div>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="update-product-input-field"
                                required
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categories && categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="update-product-input-group">
                        <label className="update-product-label">Marca</label>
                        <div className="update-product-input-with-icon">
                            <div className="update-product-input-icon">
                                <FaTrademark />
                            </div>
                            <select
                                name="marca"
                                value={product.marca}
                                onChange={handleChange}
                                className="update-product-input-field"
                                required
                            >
                                <option value="">Seleccionar Marca</option>
                                {marcas && marcas.map((marca) => (
                                    <option key={marca._id} value={marca._id}>
                                        {marca.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="update-product-input-group update-product-full-width">
                        <label className="update-product-label">Imágenes del Producto</label>
                        {product.images.map((image, index) => (
                            <div key={index} className="update-product-input-with-icon">
                                <div className="update-product-input-icon">
                                    <FaImage />
                                </div>
                                <input
                                    type="text"
                                    name="images"
                                    data-index={index}
                                    placeholder={`URL de imagen ${index + 1}`}
                                    value={image || ""}
                                    onChange={handleChange}
                                    className="update-product-input-field"
                                />
                            </div>
                        ))}
                        <p className="update-product-requirement-message">Agregue hasta 4 URLs de imágenes</p>
                    </div>

                    <div className="update-product-button-container">
                        <button
                            type="submit"
                            className="update-product-primary-button"
                        >
                            Actualizar Producto
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/manage-products')}
                            className="update-product-secondary-button"
                        >
                            Cancelar
                        </button>
                    </div>
                    
                    {id && !deleteConfirm && (
                        <button
                            type="button"
                            onClick={() => setDeleteConfirm(true)}
                            className="update-product-delete-button"
                        >
                            <FaTrash /> Eliminar Producto
                        </button>
                    )}
                    
                    {id && deleteConfirm && (
                        <div className="update-product-delete-confirmation">
                            <p className="update-product-delete-confirmation-message">
                                ¿Está seguro que desea eliminar este producto?
                            </p>
                            <div className="update-product-delete-confirmation-buttons">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="update-product-primary-button update-product-danger-button"
                                >
                                    Sí, Eliminar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(false)}
                                    className="update-product-secondary-button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                
                <div className="update-product-form-footer">
                    <p>Administrar <a href="/manage-products" className="update-product-link">todos los productos</a></p>
                </div>
            </div>
        </div>
    );
}

export default UpdateProductForm;

