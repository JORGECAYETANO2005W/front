import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { PawPrint, Menu, X, Search, ShoppingBag, Sun, Moon,ChevronDown } from 'lucide-react';
import "../styles/navbar.css";
import { useCategories } from "../context/CategoryContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { products, getProducts,getProductsByCategory  } = useProducts();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const adminMenuRef = useRef(null);
  const { categories, getCategories } = useCategories();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef(null);

  // Check if user has specific role
  const hasRole = (role) => user && user.role === role;

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };


  const handleCategorySelect = (categoryId) => {
    if (categoryId) {
      getProductsByCategory(categoryId);
      navigate('/catalog');
    } else {
      getProducts();
      navigate('/catalog');
    }
    setIsCategoryMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('vet-menu-open');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  // Fetch all products on component mount
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);


  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowResults(false);
      return;
    }

    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(results.slice(0, 8)); // Limit to 8 results
    setShowResults(true);
  }, [searchTerm, products]);

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSearchTerm("");
    setShowResults(false);
    navigate(`/products/${productId}`);
  };

  // Handle scroll events
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide header on scroll down, show on scroll up
      const header = document.querySelector('.vet-header');
      if (header) {
        if (window.scrollY > lastScrollY) {
          header.classList.add('vet-scroll-down');
          header.classList.remove('vet-scroll-up');
        } else {
          header.classList.add('vet-scroll-up');
          header.classList.remove('vet-scroll-down');
        }
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.vet-nav-menu') && !event.target.closest('.vet-hamburger')) {
        setIsMenuOpen(false);
        document.body.classList.remove('vet-menu-open');
      }

      if (isCategoryMenuOpen && categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }

      if (isProfileOpen && !event.target.closest('.vet-profile-dropdown')) {
        setIsProfileOpen(false);
      }

      if (isAdminMenuOpen && adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }

      if (showResults && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isProfileOpen, isAdminMenuOpen, showResults]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        document.body.classList.remove('vet-menu-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply ripple effect
  const addRippleEffect = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.classList.add('vet-ripple-effect');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <>
      <div className="vet-promo-banner">
        🐾 Descuento de 20% en primera consulta para mascotas nuevas. ¡Agenda ahora! 🐾
      </div>

      <header className={`vet-header ${isScrolled ? 'vet-scrolled' : ''}`}>
        <div className="vet-header-top">
          <div className="vet-container">
            <div className="vet-logo">
              <Link to="/">
                <PawPrint className="vet-logo-icon" size={32} />
                <span className="vet-brand-name">Huellitas</span>
              </Link>
            </div>

            {!isMobile && (
              <div className="vet-search-bar" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.trim() !== "" && setShowResults(true)}
                />
                <button className="vet-search-btn vet-ripple" onClick={addRippleEffect}>
                  <Search size={18} />
                </button>

                {/* Search results dropdown */}
                {showResults && filteredProducts.length > 0 && (
                  <div className="vet-search-results">
                    <ul className="vet-results-list">
                      {filteredProducts.map(product => (
                        <li key={product._id} onClick={() => handleProductSelect(product._id)} className="vet-result-item">
                          <div className="vet-result-content">
                            <div className="vet-result-img">
                              <img
                                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                                alt={product.name}
                                loading="lazy"
                              />
                            </div>
                            <div className="vet-result-name">{product.name}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showResults && filteredProducts.length === 0 && searchTerm.trim() !== "" && (
                  <div className="vet-search-results">
                    <div className="vet-no-results">No se encontraron productos</div>
                  </div>
                )}
              </div>
            )}

            <div className="vet-user-actions">
              {isMobile && (
                <button
                  className={`vet-hamburger ${isMenuOpen ? 'vet-active' : ''}`}
                  onClick={toggleMenu}
                  aria-label="Menu"
                >
                  <span className="vet-hamburger-line"></span>
                  <span className="vet-hamburger-line"></span>
                  <span className="vet-hamburger-line"></span>
                </button>
              )}

              {!isMobile && !user && (
                <div className="vet-auth-buttons">
                  <Link to="/login" className="vet-btn-login vet-ripple" onClick={addRippleEffect}>
                    <i className="fas fa-sign-out-alt"></i> Iniciar Sesión
                  </Link>
                  <Link to="/register" className="vet-btn-register vet-ripple" onClick={addRippleEffect}>
                    Registrarse
                  </Link>
                </div>
              )}

              {!isMobile && user && (
                <div className="vet-user-menu">
                  {hasRole("cliente") && (
                    <div className="vet-profile-dropdown">
                      <button
                        className="vet-dropdown-button vet-ripple"
                        onClick={toggleProfile}
                        aria-expanded={isProfileOpen}
                      >
                        <i className="fas fa-user"></i>
                        <span>Mi Perfil</span>
                        <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'}`}></i>
                      </button>
                      <div className={`vet-dropdown-content ${isProfileOpen ? 'vet-show' : ''}`}>
                        <Link to="/cliente/profile" className="vet-dropdown-link">Ver Perfil</Link>
                        <Link to="/dispositivos" className="vet-dropdown-link">Dispositivo IoT</Link>
                        <button onClick={handleLogout} className="vet-logout-btn">
                          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}

                  {hasRole("admin") && (
                    <div className="vet-admin-dropdown" ref={adminMenuRef}>
                      <button
                        className="vet-admin-button vet-ripple"
                        onClick={toggleAdminMenu}
                        aria-expanded={isAdminMenuOpen}
                      >
                        <i className="fas fa-user-shield"></i>
                        <span>Panel Admin</span>
                        <i className={`fas fa-chevron-${isAdminMenuOpen ? 'up' : 'down'}`}></i>
                      </button>
                      <div className={`vet-admin-content ${isAdminMenuOpen ? 'vet-show' : ''}`}>
                        <Link to="/admin/profile-admin" className="vet-admin-link">
                          <i className="fas fa-user-cog"></i> Perfil Admin
                        </Link>
                        <Link to="/users-management" className="vet-admin-link">
                          <i className="fas fa-users"></i> Gestionar Usuarios
                        </Link>
                        <Link to="/manage-products" className="vet-admin-link">
                          <i className="fas fa-box"></i> Gestionar Productos
                        </Link>
                        <Link to="/empresa-manage" className="vet-admin-link">
                          <i className="fas fa-building"></i> Empresa
                        </Link>
                        <Link to="/dispositivos-manage" className="vet-admin-link">
                          <i className="fas fa-building"></i> Gestionar Dispositivos
                        </Link>
                        <Link to="/marcas-manage" className="vet-admin-link">
                          <i className="fas fa-box"></i> Gestionar Marcas
                        </Link>
                        <Link to="/categories-manage" className="vet-admin-link">
                          <i className="fas fa-box"></i> Gestionar Categorias
                        </Link>
                        <button onClick={handleLogout} className="vet-logout-btn">
                          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {isMobile && (
          <div className="vet-mobile-search">
            <div className="vet-search-bar-mobile" ref={searchRef}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() !== "" && setShowResults(true)}
              />
              <button className="vet-search-btn-mobile vet-ripple" onClick={addRippleEffect}>
                <Search size={18} />
              </button>

              {/* Mobile search results dropdown */}
              {showResults && filteredProducts.length > 0 && (
                <div className="vet-search-results-mobile">
                  <ul className="vet-results-list-mobile">
                    {filteredProducts.map(product => (
                      <li key={product._id} onClick={() => handleProductSelect(product._id)} className="vet-result-item-mobile">
                        <div className="vet-result-content-mobile">
                          <div className="vet-result-img-mobile">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                              alt={product.name}
                              loading="lazy"
                            />
                          </div>
                          <div className="vet-result-name-mobile">{product.name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showResults && filteredProducts.length === 0 && searchTerm.trim() !== "" && (
                <div className="vet-search-results-mobile">
                  <div className="vet-no-results-mobile">No se encontraron productos</div>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className={`vet-header-nav ${isMobile ? 'vet-mobile' : ''}`}>
          <div className="vet-nav-container">
            <ul className={`vet-nav-menu ${isMenuOpen && isMobile ? 'vet-active' : ''}`}>
              {isMobile && (
                <button className="vet-close-menu" onClick={toggleMenu}>
                  <X size={24} />
                </button>
              )}

              {/* Public navigation links */}
              <li className="vet-nav-item"><Link to="/" className="vet-nav-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
              {/*   <li className="vet-nav-item"><Link to="/catalog" className="vet-nav-link" onClick={() => setIsMenuOpen(false)}>Productos</Link></li> */}
            
              <li className="vet-nav-item">
                <div className="vet-category-dropdown" ref={categoryMenuRef}>
                  <button
                    className="vet-nav-link vet-category-button"
                    onClick={toggleCategoryMenu}
                    aria-expanded={isCategoryMenuOpen}
                  >
                    Productos <ChevronDown size={16} className={`vet-chevron ${isCategoryMenuOpen ? 'vet-rotate' : ''}`} />
                  </button>
                  <div className={`vet-category-content ${isCategoryMenuOpen ? 'vet-show' : ''}`}>
                    <div
                      className="vet-category-link"
                      onClick={() => handleCategorySelect(null)}
                    >
                      Todas las categorías
                    </div>
                    {categories.map(category => (
                      <div
                        key={category._id}
                        className="vet-category-link"
                        onClick={() => handleCategorySelect(category._id)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li className="vet-nav-item"><Link to="/nosotros" className="vet-nav-link" onClick={() => setIsMenuOpen(false)}>Nosotros</Link></li>
              <li className="vet-nav-item"><Link to="/contact" className="vet-nav-link" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
              <li className="vet-nav-item"><Link to="/faqs" className="vet-nav-link" onClick={() => setIsMenuOpen(false)}>Preguntas Frecuentes</Link></li>

              {/* Only show admin links in the mobile menu (desktop uses dropdown in header) */}
              {isMobile && hasRole("admin") && (
                <li className="vet-mobile-admin">
                  <div className="vet-admin-title">
                    <i className="fas fa-user-shield"></i> Administración
                  </div>
                  <ul className="vet-admin-links">
                    <li className="vet-admin-item">
                      <Link to="/admin/profile-admin" className="vet-admin-link-mobile" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-user-cog"></i> Perfil Admin
                      </Link>
                    </li>
                    <li className="vet-admin-item">
                      <Link to="/users-management" className="vet-admin-link-mobile" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-users"></i> Gestionar Usuarios
                      </Link>
                    </li>
                    <li className="vet-admin-item">
                      <Link to="/manage-products" className="vet-admin-link-mobile" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-box"></i> Gestionar Productos
                      </Link>
                    </li>
                    <li className="vet-admin-item">
                      <Link to="/empresa-manage" className="vet-admin-link-mobile" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-building"></i> Empresa
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Mobile-only menu items for user actions */}
              {isMobile && !user && (
                <div className="vet-mobile-auth">
                  <li className="vet-auth-item">
                    <Link to="/login" className="vet-mobile-login" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                    </Link>
                  </li>
                  <li className="vet-auth-item">
                    <Link to="/register" className="vet-mobile-register" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-user-plus"></i> Registrarse
                    </Link>
                  </li>
                </div>
              )}

              {isMobile && user && hasRole("cliente") && (
                <div className="vet-mobile-user">
                  <li className="vet-user-item">
                    <Link to="/cliente/profile" className="vet-user-link" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-user"></i> Ver Perfil
                    </Link>
                  </li>
                  <li className="vet-user-item">
                    <Link to="/dispositivos" className="vet-user-link" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-microchip"></i> Dispositivo IoT
                    </Link>
                  </li>
                  <li className="vet-user-item">
                    <button onClick={handleLogout} className="vet-mobile-logout">
                      <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                  </li>
                </div>
              )}

              {isMobile && user && hasRole("admin") && (
                <div className="vet-mobile-user">
                  <li className="vet-user-item">
                    <button onClick={handleLogout} className="vet-mobile-logout">
                      <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </nav>

        {isMenuOpen && isMobile && <div className="vet-menu-overlay" onClick={toggleMenu}></div>}
      </header>
    </>
  );
}

export default Navbar;

