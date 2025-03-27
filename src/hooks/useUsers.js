import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Hook para obtener dispositivos del usuario
export const useUser = (reloadDevices) => {
    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const obtenerDispositivos = async () => {
            if (!user?.id) {
                setDispositivos([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Obtener los dispositivos del usuario actual
                const response = await api.get(`/usuarios/${user.id}/dispositivos`);
                setDispositivos(response.data);
            } catch (error) {
                console.error("Error al obtener dispositivos", error);
                setDispositivos([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        obtenerDispositivos();
    }, [user?.id,reloadDevices]);

    return { dispositivos, loading };
};