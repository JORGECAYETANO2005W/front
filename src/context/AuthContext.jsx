import { createContext, useState, useContext, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  verifyEmailRequest,
  getUsersRequest,
  getUserRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../api/auth.js";


export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para registrar un nuevo usuario
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.data.success) {
        setUser(null);
        return { success: true };
      }
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      } else {
        setErrors([error.response.data.message]);
      }
    }
  };

  // Función para verificar el correo electrónico
  const verifyEmail = async (email, code) => {
    try {
      if (!email || !code) {
        return {
          success: false,
          message: "Email y código son requeridos",
        };
      }

      const res = await verifyEmailRequest(email, code);
      console.log("Respuesta del servidor en verifyEmail:", res?.data);

      if (res?.data?.success) {
        return {
          success: true,
          message: res.data.message || "Email verificado exitosamente",
        };
      }

      return {
        success: false,
        message: res?.data?.message || "Código incorrecto o expirado",
      };
    } catch (error) {
      console.error("Error en verifyEmail:", {
        responseData: error.response?.data,
        message: error.message,
        status: error.response?.status,
      });

      if (error.response?.status === 400) {
        return {
          success: false,
          message: "Código inválido o sesión expirada",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Error al verificar el código",
      };
    }
  };

  // Función para verificar el token de autenticación
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    console.log("Iniciando verificación de token:", !!token);

    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const res = await verifyTokenRequest();
      console.log("Respuesta de verificación:", res.data);

      if (res.data && res.data.id) {
        setUser(res.data);
        setIsAuthenticated(true);
        console.log("Usuario autenticado:", res.data);
      } else {
        console.warn("Respuesta sin datos de usuario:", res.data);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error en verificación:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const signin = async (data) => {
    try {
      setLoading(true);
      const response = await loginRequest(data);
      console.log("Respuesta de login:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user || response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error en signin:", error);
      setErrors([error.response?.data?.message || "Error al iniciar sesión"]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Función para obtener todos los usuarios
  const getUsers = async () => {
    try {
      return await getUsersRequest(); 
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  };

  // Función para obtener un usuario por su ID
  const getUser = async (id) => {
    try {
      const res = await getUserRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  };

  // Función para actualizar un usuario
  const updateUser = async (id, userData) => {
    try {
      const res = await updateUserRequest(id, userData);
      return res.data;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    try {
      const res = await deleteUserRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("AuthProvider montado - verificando token");
    verifyToken();
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        verifyEmail,
        isAuthenticated,
        errors,
        verifyToken,
        getUsers,
        getUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

