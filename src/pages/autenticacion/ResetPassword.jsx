import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                setIsValidToken(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/verifyToken/${token}`);
                const data = await response.json();
                
                if (response.ok) {
                    setIsValidToken(true);
                } else {
                    toast.error(`Error de verificación: ${data.message}`, {
                        className: 'recuperacion-toast-error'
                    });
                    setIsValidToken(false);
                }
            } catch (error) {
                toast.error('Error verificando el token', {
                    className: 'recuperacion-toast-error'
                });
                setIsValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password) {
            toast.warn('Por favor ingrese una nueva contraseña', {
                className: 'recuperacion-toast-error'
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden', {
                className: 'recuperacion-toast-error'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message, {
                    className: 'recuperacion-toast-success'
                });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.message || 'Error al restablecer la contraseña', {
                    className: 'recuperacion-toast-error'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Hubo un problema al restablecer tu contraseña', {
                className: 'recuperacion-toast-error'
            });
        }
    };

    if (loading) {
        return (
            <div className="recuperacion-fondo">
                <div className="recuperacion-container">
                    <div className="recuperacion-box" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px'}}>
                        <p>Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recuperacion-fondo">
            <div className="recuperacion-container">
                {isValidToken ? (
                    <div className="recuperacion-box">
                        <h1 className="recuperacion-titulo">Restablecer contraseña</h1>
                        
                        <form className="recuperacion-form" onSubmit={handleSubmit}>
                            <div className="recuperacion-input-grupo">
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="recuperacion-input"
                                    minLength="6"
                                    required
                                />
                            </div>
                            
                            <div className="recuperacion-input-grupo">
                                <input
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="recuperacion-input"
                                    minLength="6"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="recuperacion-boton"
                            >
                                Restablecer contraseña
                            </button>
                        </form>
                        
                        <a href="/login" className="recuperacion-volver">Volver al inicio de sesión</a>
                    </div>
                ) : (
                    <div className="recuperacion-box" style={{textAlign: 'center'}}>
                        <h2 className="recuperacion-titulo">Token expirado o no válido</h2>
                        <p style={{marginBottom: '20px', color: '#555'}}>
                            El enlace para restablecer tu contraseña ha expirado o no es válido.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="recuperacion-boton"
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                )}
            </div>
            
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
                className="recuperacion-toast-container"
            />
        </div>
    );
};

export default ResetPassword;

