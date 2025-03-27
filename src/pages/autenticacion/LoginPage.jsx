import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/login.css';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await signin(data);
  });

  useEffect(() => {
    if (signinErrors.length > 0) {
      signinErrors.forEach(error => toast.error(error, { position: "top-right" }));
    }
  }, [signinErrors]);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Inicio de sesión exitoso!", { position: "top-right" });
      switch (user.role) {
        case 'admin':
          navigate("/admin/profile-admin");
          break;
        case 'cliente':
          navigate("/cliente/profile");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="login-fondo">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Iniciar Sesion</h1>
          <form className="login-form" onSubmit={onSubmit}>
            <label className="login-label">Correo electrónico:</label>
            <div className="login-input-group">
              <input
                type="email"
                {...register("email", { required: "El correo es requerido" })}
                className="login-input-field"
                placeholder="Correo electrónico"
              />
              {errors.email && <p className="login-error-message">{errors.email.message}</p>}
            </div>

            <label className="login-label">Contraseña:</label>
            <div className="login-input-group">
              <input
                type="password"
                {...register("password", { required: "La contraseña es requerida" })}
                className="login-input-field"
                placeholder="Contraseña"
              />
              {errors.password && <p className="login-error-message">{errors.password.message}</p>}
            </div>

            <button type="submit" className="login-submit-button">Iniciar Sesión</button>
          </form>
          <br />

          <p className="login-footer">
            ¿Aún no tienes una cuenta?
            <Link to="/register" className="login-link"> Regístrate ahora</Link>
          </p>
          <p className="login-footer">
            <Link to="/forgot-password" className="login-link">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

