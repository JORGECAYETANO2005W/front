import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerifyPage() {
    const [code, setCode] = useState("");
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await verifyEmail(email, code);
            if (result.success) {
                toast.success("Verificación exitosa. Redirigiendo...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error("Código incorrecto o expirado");
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            toast.error("Hubo un error. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="recuperacion-fondo">
            <div className="recuperacion-container">
                <div className="recuperacion-box">
                    <h2 className="recuperacion-titulo">Verificar Correo</h2>
                    <p className="txt">Hemos enviado un código a <strong>{email}</strong>. Ingrésalo para completar tu registro.</p>
                    <form onSubmit={handleSubmit} className="recuperacion-form">
                        <div className="recuperacion-input-grupo">
                            <input
                                type="text"
                                className="recuperacion-input"
                                placeholder="Código de verificación"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="recuperacion-boton">Verificar</button>
                    </form>
                    <a href="/login" className="recuperacion-volver">Volver al inicio de sesión</a>
                </div>
            </div>
        </div>
    );
}

export default VerifyPage;