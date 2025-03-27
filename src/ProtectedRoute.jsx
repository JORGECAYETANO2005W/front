// Este componente es una ruta protegida en React, utilizada para restringir el acceso a ciertas rutas según la autenticación del usuario.
// Si el usuario no está autenticado, será redirigido a la página de inicio de sesión.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();




  return <Outlet />;
}

export default ProtectedRoute;

