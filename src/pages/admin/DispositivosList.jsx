import React, { useEffect, useState } from 'react';
import instance from '../../api/axios'; // Ajusta la ruta según la ubicación de tu archivo axios.js

function DispositivosList() {
    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDispositivos = async () => {
          try {
            const response = await instance.get('/dispositivos'); // Usa la ruta correcta
            console.log("Respuesta de la API:", response.data); // Verifica la estructura de la respuesta
            setDispositivos(response.data);
            setLoading(false);
          } catch (error) {
            console.error("Error al obtener dispositivos:", error);
            setError(error.message);
            setLoading(false);
          }
        };
      
        fetchDispositivos();
      }, []);

    if (loading) {
        return (
            <div className="vet-admin-loading-container">
                <div className="vet-admin-loading-spinner"></div>
                <p>Cargando dispositivos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vet-admin-error-container">
                <p>Error: {error}</p>
                <button className="vet-admin-retry-btn" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    if (!Array.isArray(dispositivos) || dispositivos.length === 0) {
        return (
            <div className="vet-admin-empty-state">
                <p>No se encontraron dispositivos.</p>
            </div>
        );
    }

    return (
        <div className="vet-admin-table-container">
            <div className="vet-admin-table-header">
                <h1 className="vet-admin-table-title">Lista de Dispositivos</h1>
                <div className="vet-admin-search-container">
                    <input
                        type="text"
                        className="vet-admin-search-input"
                        placeholder="Buscar dispositivo..."
                    />
                
                </div>
            </div>
            <div className="vet-admin-table-responsive">
                <table className="vet-admin-table">
                    <thead>
                        <tr>
                            <th>Nombre del Dispositivo</th>
                         
                            <th>Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispositivos.map((dispositivo) => (
                            <tr key={dispositivo._id}>
                                <td data-label="Nombre del Dispositivo">{dispositivo.name}</td>
                           
                                <td data-label="Usuario">{dispositivo.user ? dispositivo.user.realName : 'Sin usuario'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DispositivosList;