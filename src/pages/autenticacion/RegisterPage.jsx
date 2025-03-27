import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/register.css";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  // Mostrar errores del servidor usando toastify
  useEffect(() => {
    if (!registerErrors) return;

    if (typeof registerErrors === 'string') {
      toast.error(registerErrors);
    } else if (Array.isArray(registerErrors)) {
      registerErrors.forEach(error => toast.error(error));
    } else if (typeof registerErrors === 'object') {
      Object.values(registerErrors).forEach(error => toast.error(error));
    }
  }, [registerErrors]);

  const watchPassword = watch("password", "");
  const watchConfirmPassword = watch("confirmPassword", "");
  const watchEmail = watch("email", "");
  const watchPhone = watch("phoneNumber", "");

  useEffect(() => {
    if (isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  const onSubmit = async (values) => {
    try {
      const result = await signup(values);
      if (result?.success) {
        toast.success("¡Registro exitoso! Verifica tu correo electrónico.");
        navigate("/verify", { state: { email: values.email } });
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      toast.error("Ocurrió un error durante el registro. Inténtalo de nuevo.");
    }
  };

  const getPasswordFirstError = (password) => {
    if (password.length < 8) return "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";
    if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula";
    if (!/\d/.test(password)) return "Debe contener al menos un número";
    if (!/[@$!%*?&]/.test(password)) return "Debe contener al menos un símbolo especial (@$!%*?&)";
    return null;
  };

  const getEmailFirstError = (email) => {
    if (!email) return "El correo es requerido";
    if (!email.includes('@')) return "Debe contener @";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return "Formato de correo inválido";
    return null;
  };

  const getPhoneFirstError = (phone) => {
    if (!phone) return "El número es requerido";
    if (!/^\d+$/.test(phone)) return "Solo debe contener números";
    if (phone.length !== 10) return "Debe tener exactamente 10 dígitos";
    return null;
  };

  const getNameFirstError = (name, fieldName) => {
    if (!name) return `${fieldName} es requerido`;
    if (name.length < 2) return "Mínimo 2 caracteres";
    if (name.length > 50) return "Máximo 50 caracteres";
    return null;
  };

  // Preguntas secretas estáticas
  const secretQuestions = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿Cuál es tu ciudad de nacimiento?",
    "¿Cuál es tu comida favorita?",
    "¿Cuál es el nombre de tu mejor amigo de la infancia?",
    "¿Cuál es tu película favorita?"
  ];

  return (
    <div className="register-fondo">
      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">Registro</h1>
          
          <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="register-form-row">
              {/* Columna izquierda */}
              <div className="register-form-column">
                {/* Nombre real */}
                <div className="register-form-field">
                  <label htmlFor="realName" className="register-label">Nombre</label>
                  <div className="register-input-with-icon">
                    <div className="register-input-icon">
                      <FaUser />
                    </div>    
                    <input
                      type="text"
                      {...register("realName", {
                        required: true,
                        minLength: 2,
                        maxLength: 50
                      })}
                      className="register-input-field"
                      placeholder="Nombre de usuario"
                    />
                  </div>
                  {watch("realName") !== undefined && (
                    <div className="register-requirement-message">
                      {getNameFirstError(watch("realName"), "Nombre")}
                    </div>
                  )}
                </div>

                {/* Correo electrónico */}
                <div className="register-form-field">
                  <label htmlFor="email" className="register-label">Correo electrónico</label>
                  <div className="register-input-with-icon">
                    <div className="register-input-icon">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      {...register("email", {
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      })}
                      className="register-input-field"
                      placeholder="Correo electrónico"
                    />
                  </div>
                  {watchEmail && (
                    <div className="register-requirement-message">
                      {getEmailFirstError(watchEmail)}
                    </div>
                  )}
                </div>

                {/* Contraseña */}
                <div className="register-form-field">
                  <label htmlFor="password" className="register-label">Contraseña</label>
                  <div className="register-input-with-icon">
                    <div className="register-input-icon">
                      <FaLock />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: true,
                        minLength: 8,
                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/
                      })}
                      className="register-input-field"
                      placeholder="Contraseña"
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="register-icon-button">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {watchPassword && (
                    <div className="register-requirement-message">
                      {getPasswordFirstError(watchPassword)}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="register-form-column">
                {/* Apellido */}
                <div className="register-form-field">
                  <label htmlFor="lastName" className="register-label">Apellido</label>
                  <div className="register-input-with-icon">
                    <div className="register-input-icon">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: true,
                        minLength: 2,
                        maxLength: 50
                      })}
                      className="register-input-field"
                      placeholder="Apellido"
                    />
                  </div>
                  {watch("lastName") !== undefined && (
                    <div className="register-requirement-message">
                      {getNameFirstError(watch("lastName"), "Apellido")}
                    </div>
                  )}
                </div>

                {/* Número de teléfono */}
                <div className="register-form-field">
                  <label htmlFor="phoneNumber" className="register-label">Número de teléfono</label>
                  <div className="register-input-with-icon">
                    <div className="register-input-icon">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      {...register("phoneNumber", {
                        required: true,
                        pattern: /^\d{10}$/
                      })}
                      className="register-input-field"
                      placeholder="Número de teléfono"
                    />
                  </div>
                  {watchPhone && (
                    <div className="register-requirement-message">
                      {getPhoneFirstError(watchPhone)}
                    </div>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="register-form-field">
                  <label htmlFor="confirmPassword" className="register-label">Confirmar Contraseña</label>
                  <div className="register-input-with-icon">
                    <div className="register-input-icon">
                      <FaLock />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: true,
                        validate: value => value === getValues("password")
                      })}
                      className="register-input-field"
                      placeholder="Confirmar contraseña"
                    />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="register-icon-button">
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {watchConfirmPassword && watchPassword !== watchConfirmPassword && (
                    <div className="register-requirement-message">
                      Las contraseñas no coinciden
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pregunta secreta (solo visual) */}
            <div className="register-form-field full-width">
              <label htmlFor="secretQuestion" className="register-label">Pregunta secreta</label>
              <div className="register-input-with-icon">
                <div className="register-input-icon">
                  <FaKey />
                </div>
                <select
                  className="register-input-field"
                >
                  {secretQuestions.map((question, index) => (
                    <option key={index} value={question}>{question}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Palabra secreta */}
            <div className="register-form-field full-width">
              <label htmlFor="secretWord" className="register-label">Palabra secreta</label>
              <div className="register-input-with-icon">
                <div className="register-input-icon">
                  <FaKey />
                </div>
                <input
                  type="text"
                  {...register("secretWord", {
                    required: true,
                    minLength: 4
                  })}
                  className="register-input-field"
                  placeholder="Palabra secreta"
                />
              </div>
              {watch("secretWord") && watch("secretWord").length < 4 && (
                <div className="register-requirement-message">
                  Mínimo 4 caracteres
                </div>
              )}
            </div>

            <button type="submit" className="register-submit-button">Registrar</button>
          </form>

          <p className="register-footer">
            ¿Ya tienes una cuenta?
            <Link to="/login" className="register-link"> Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
      
      {/* ToastContainer para mostrar notificaciones */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default RegisterPage;