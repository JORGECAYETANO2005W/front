import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDispositivos } from '../hooks/useDispositivos';
import '../styles/ModalAddDevice.css';

const ModalAddDevice = ({ visible, onClose, onDeviceAdded }) => {
    const { user } = useAuth();
    const { asignarDispositivo, loading } = useDispositivos();
    const [formValues, setFormValues] = useState({
        nombrePersonalizado: '',
        macAddress: ''
    });
    const [errors, setErrors] = useState({
        nombrePersonalizado: '',
        macAddress: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { ...errors };
        
        if (!formValues.nombrePersonalizado.trim()) {
            newErrors.nombrePersonalizado = 'Por favor ingrese un nombre';
            isValid = false;
        }
        
        if (!formValues.macAddress.trim()) {
            newErrors.macAddress = 'El código del dispositivo es requerido';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleAddDevice = async (e) => {
        e.preventDefault();
        
        if (!validate() || !user || !user.id) return;
        
        const deviceData = {
            macAddress: formValues.macAddress,
            name: formValues.nombrePersonalizado
        };
        
        await asignarDispositivo(deviceData);
        onDeviceAdded(); // Llama a la función de callback
    };

    if (!visible) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Agregar Dispositivo</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleAddDevice} className="device-form">
                    <div className="form-group">
                        <label htmlFor="nombrePersonalizado">Nombre del dispositivo</label>
                        <input
                            type="text"
                            id="nombrePersonalizado"
                            name="nombrePersonalizado"
                            value={formValues.nombrePersonalizado}
                            onChange={handleChange}
                            className={errors.nombrePersonalizado ? 'input-error' : ''}
                        />
                        {errors.nombrePersonalizado && <span className="error-message">{errors.nombrePersonalizado}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="macAddress">Código del dispositivo</label>
                        <input
                            type="text"
                            id="macAddress"
                            name="macAddress"
                            value={formValues.macAddress}
                            onChange={handleChange}
                            className={errors.macAddress ? 'input-error' : ''}
                        />
                        {errors.macAddress && <span className="error-message">{errors.macAddress}</span>}
                    </div>
                    
                    <div className="button-group">
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Asignando...</span>
                                </>
                            ) : "Agregar Dispositivo"}
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddDevice;