import { useState } from 'react';
import api from '../api/axios';

export const useDispositivos = () => {
    const [loading, setLoading] = useState(false);

    const asignarDispositivo = async (values) => {
        try {
            setLoading(true);
            console.log("Values received in hook:", values);
            
            // Make sure data structure matches backend expectations
            const requestData = {
                macAddress: values.macAddress,
                name: values.name,
                // No need to add user here if it's coming from the authentication token
            };
            
            // Use POST instead of PUT for creating a new device
            const response = await api.post(`/dispositivos`, requestData);
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al asignar el dispositivo:", error);
            throw error; // Re-throw to allow handling in the component
        } finally {
            setLoading(false);
        }
    };

    return { asignarDispositivo, loading };
};