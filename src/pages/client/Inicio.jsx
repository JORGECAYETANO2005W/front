import { PlusOutlined, DesktopOutlined, MobileOutlined, BulbOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import ModalAddDevice from '../../components/ModalAddDevice';
import { useUser } from '../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import '../../styles/inicio.css';

const Inicio = () => {
    const [modal, setModal] = useState(false);
    const [reloadDevices, setReloadDevices] = useState(false); // Estado para recargar dispositivos
    const { dispositivos, loading, reload } = useUser(reloadDevices); // Pasar reloadDevices como dependencia
    const navigation = useNavigate();

    // Función para recargar los dispositivos
    const handleDeviceAdded = () => {
        setReloadDevices(prev => !prev); // Cambia el estado para recargar
        setModal(false); // Cierra el modal
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando dispositivos...</p>
            </div>
        );
    }

    // Función para determinar el icono según el tipo de dispositivo
    const getIcon = (tipo) => {
        const deviceType = tipo || 'Ordenador';
        
        switch (deviceType) {
            case 'Ordenador':
                return <DesktopOutlined className="device-icon desktop-icon" />;
            case 'Móvil':
                return <MobileOutlined className="device-icon mobile-icon" />;
            case 'Luz':
                return <BulbOutlined className="device-icon light-icon" />;
            default:
                return <DesktopOutlined className="device-icon default-icon" />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Mis Dispositivos</h1>
                <p>Gestiona todos tus dispositivos inteligentes</p>
            </div>
            
            <div className="devices-grid">
                {dispositivos.map((dispositivo) => (
                    <Card 
                        key={dispositivo.macAddress}
                        className="device-card"
                        onClick={() => { navigation(`/dispositivo/${dispositivo.macAddress}`) }}
                    >
                        <div className="device-icon-container">
                            {getIcon(dispositivo.tipo)}
                        </div>
                        <h3 className="device-name">{dispositivo.name}</h3>
                        <p className="device-type">{dispositivo.tipo || 'Dispositivo'}</p>
                        <div className="device-status">
                            <span className={`status-indicator ${dispositivo.status ? 'online' : 'offline'}`}></span>
                            <span className="status-text">{dispositivo.status ? 'Conectado' : 'Desconectado'}</span>
                        </div>
                    </Card>
                ))}
                
                <Card className="add-device-card" onClick={() => setModal(true)}>
                    <div className="add-icon-container">
                        <PlusOutlined className="add-icon" />
                    </div>
                    <h3 className="add-text">Agregar</h3>
                    <p className="add-description">Nuevo dispositivo</p>
                </Card>
            </div>
            
            <ModalAddDevice
                visible={modal}
                onClose={() => setModal(false)}
                onDeviceAdded={handleDeviceAdded} // Pasa la función de callback
            />
        </div>
    );
};

export default Inicio;
