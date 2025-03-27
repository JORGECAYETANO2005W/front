import { useState } from 'react';
import './../../styles/forgotPassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [secretWord, setSecretWord] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Por favor ingresa tu correo electrónico', {
                className: 'recuperacion-toast-error'
            });
            return;
        }
        
        if (!secretWord) {
            toast.error('Por favor ingresa tu palabra secreta', {
                className: 'recuperacion-toast-error'
            });
            return;
        }
        
        try {
            const response = await fetch('http://localhost:4000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, secretWord }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message || 'Correo de recuperación enviado', {
                    className: 'recuperacion-toast-success'
                });
            } else {
                toast.error(data.message || 'Error al procesar la solicitud', {
                    className: 'recuperacion-toast-error'
                });
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor', {
                className: 'recuperacion-toast-error'
            });
        }
    };
    
    return (
        <div className="recuperacion-fondo">
            <div className="recuperacion-container">
                <div className="recuperacion-box">
                    <h1 className="recuperacion-titulo">Recuperación de contraseña</h1>
                    
                    <form className="recuperacion-form" onSubmit={handleSubmit}>
                        <div className="recuperacion-input-grupo">
                            <input
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                className="recuperacion-input"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="recuperacion-input-grupo">
                            <input
                                type="text"
                                placeholder="Ingresa tu palabra secreta"
                                value={secretWord}
                                className="recuperacion-input"
                                onChange={(e) => setSecretWord(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="recuperacion-boton"
                        >
                            Enviar instrucciones
                        </button>
                    </form>
                    
                    <a href="/login" className="recuperacion-volver">Volver al inicio de sesión</a>
                </div>
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

export default ForgotPassword;

