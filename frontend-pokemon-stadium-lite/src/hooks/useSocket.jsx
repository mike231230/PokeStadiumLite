import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (backendUrl) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Si aún no hay URL configurada, no hacemos nada
        if (!backendUrl) return;

        // Inicializamos la conexión utilizando la URL base proveída dinámicamente
        const socketInstance = io(backendUrl);

        socketInstance.on('connect', () => {
            console.log('Conectado al servidor:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Desconectado del servidor');
            setIsConnected(false);
        });

        // Guardamos la instancia en el estado para retornarla
        setSocket(socketInstance);

        // Función de limpieza: se ejecuta cuando el componente se desmonta
        return () => {
            socketInstance.disconnect();
        };
    }, [backendUrl]);

    return { socket, isConnected };
};