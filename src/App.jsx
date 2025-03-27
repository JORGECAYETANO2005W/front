import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx'; // Añadido correctamente
import { MarcaProvider } from './context/MarcaContext.jsx'; // Añadido correctamente
import ProtectedRoute from './ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas públicas
import HomePage from './pages/HomePage.jsx';
import ContactPage from './pages/publica/ContactPage.jsx';
import CatalogPage from './pages/publica/CatalogPage.jsx';
import ProductDetailPage from './pages/publica/ProductDetailPage.jsx';


// Páginas de autenticación
import RegisterPage from './pages/autenticacion/RegisterPage.jsx';
import LoginPage from './pages/autenticacion/LoginPage.jsx';
import ForgotPassword from './pages/autenticacion/ForgotPassword.jsx';
import ResetPassword from './pages/autenticacion/ResetPassword.jsx';
import VerificationPage from './pages/autenticacion/VerificationPage.jsx';

// Páginas privadas - Cliente
import ProfilePage from './pages/client/ProfilePage.jsx';

import IoTDevicePage from './pages/client/IoTDevicePage.jsx';

// Páginas privadas - Administrador
import ManageProductsPage from './pages/admin/ManageProductsPage.jsx';
import UsersManagementPage from './pages/admin/UsersManagementPage.jsx';
import ProfilePageAdmin from './pages/admin/ProfilePageAdmin.jsx';

// Pagina de acceso denegado
import AccessDeniedPage from './pages/AccessDeniedPage.jsx'
import UpdateProductForm from './pages/admin/UpdateProductForm.jsx';
import Footer from './pages/publica/Footer.jsx';
import ProductCreate from './pages/admin/ProductCreate.jsx';
import MisionesList from './pages/admin/MisionList.jsx';
import { MisionProvider } from './context/misionContext.jsx';
import { VisionProvider } from './context/visionContext.jsx';
import VisionesList from './pages/admin/VisionList.jsx';
import { PoliticaProvider } from './context/politicaContext.jsx';
import PoliticasList from './pages/admin/politicaList.jsx';
import { FAQProvider } from './context/preguntasFre.jsx';
import FAQsList from './pages/admin/PreguntasFre.jsx';
import EmpresaPage from './pages/admin/EmpresaPage.jsx';
import Nosotros from './pages/publica/Nosotros.jsx';

import PreguntasFrecuentes from './pages/publica/PreguntasFrecuentes.jsx';
//import ContactoPage from './pages/admin/ContactoPage.jsx';
import { UbicacionProvider } from './context/UbicacionContext.jsx';
import UbicacionList from './pages/admin/UbicacionList.jsx';
import { RedesSocialesProvider } from './context/RedesSociales.jsx';
import RedesSocialesList from './pages/admin/RedesSocialesList.jsx';
import Inicio from './pages/client/Inicio.jsx';
import UserDashboard from './pages/client/UserDashboard.jsx';
import DispositivosList from './pages/admin/DispositivosList.jsx';
import CategoriesList from './pages/admin/CategoriesList.jsx';
import MarcasList from './pages/admin/MarcasList.jsx';
import Contact from './pages/admin/ContactosList.jsx'
import { ContactoProvider } from './context/contactosContext.jsx';
import { CitaProvider } from './context/CitasContext.jsx';
import CitasList from './pages/admin/CitasList.jsx';
import UserCitas from './pages/client/UserCitas.jsx';




function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <MarcaProvider>
            <MisionProvider>
              <VisionProvider>
                <PoliticaProvider>
                  <FAQProvider>
                 <UbicacionProvider>
                  <RedesSocialesProvider>
                  <ContactoProvider>
                    <CitaProvider>
                      
                      <BrowserRouter>
                        <main>
                          <Navbar /> {/* Barra de navegación */}
                          <ToastContainer position="top-right" autoClose={3000} />

                          <Routes>
                            {/* 📌 Rutas Públicas */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            
                            <Route path="/catalog" element={<CatalogPage />} />
                      
                            <Route path="/products/:id" element={<ProductDetailPage />} />
                       
                            <Route path="/nosotros" element={<Nosotros />} />
                            <Route path="/faqs" element={<PreguntasFrecuentes />} />
                            <Route path="/userCitas" element={<UserCitas />} />


                            {/* 📌 Autenticación */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                            <Route path="/verify" element={<VerificationPage />} />
                            <Route path="/cliente/citas" element={<UserCitas />} />
                              

                            {/* 📌 Rutas Protegidas */}
                            <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                              <Route path="/cliente/profile" element={<ProfilePage />} />

                            
                              <Route path="/iot-device" element={<IoTDevicePage />} />
                              <Route path="/dispositivo/:id" element={<UserDashboard />} />
                              <Route path="/dispositivos" element={<Inicio />} />

                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                              <Route path="/admin/profile-admin" element={<ProfilePageAdmin />} />
                                {/*   <Route path="/contacto-manage" element={<ContactoPage />} /> */}
                            
                              <Route path="/manage-products" element={<ManageProductsPage />} />
                              <Route path="/products/create" element={<ProductCreate />} />
                              <Route path="/products/update/:id" element={<UpdateProductForm />} />
                              <Route path="/users-management" element={<UsersManagementPage />} />
                              <Route path="/empresa-manage" element={<EmpresaPage />} />
                              <Route path="/misiones" element={<MisionesList />} />
                              <Route path="/visiones" element={<VisionesList />} />
                              <Route path="/politicas" element={<PoliticasList />} />
                              <Route path="/preguntasFre" element={<FAQsList />} />
                              <Route path="/ubicacion" element={<UbicacionList />} />
                              <Route path="/redesSociales" element={<RedesSocialesList />} />
                              <Route path="/dispositivos-manage" element={<DispositivosList />} />
                              <Route path="/categories-manage" element={<CategoriesList />} />
                              <Route path="/marcas-manage" element={<MarcasList />} />
                              
                              <Route path="/manage-contact" element={<Contact />} />
                              <Route path="/citaslist" element={<CitasList />} />
                              
                            </Route>

                            {/* 📌 Página de Acceso Denegado */}
                            <Route path="/access-denied" element={<AccessDeniedPage />} />
                          </Routes>

                          <Footer /> {/* Footer */}
                        </main>
                      </BrowserRouter>
                      </CitaProvider>
                      </ContactoProvider>
                      </RedesSocialesProvider>
                      </UbicacionProvider>
                  </FAQProvider>
                </PoliticaProvider>
              </VisionProvider>
            </MisionProvider>
          </MarcaProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
