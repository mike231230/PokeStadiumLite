import { useState, useEffect } from 'react';
import ConfigView from './views/ConfigView';
import { useSocket } from './hooks/useSocket';
import LobbyView from "./views/LobbyView.jsx";
import './App.css';

function App() {
    const [backendUrl, setBackendUrl] = useState('');

    // 1. Al cargar la app, revisamos si la URL ya está guardada localmente
    useEffect(() => {
        const savedUrl = localStorage.getItem('backendUrl');
        if (savedUrl) {
            setBackendUrl(savedUrl);
        }
    }, []);

    // 2. Pasamos la URL al hook. Si está vacía, el hook simplemente espera.
    const { socket, isConnected } = useSocket(backendUrl);

    // 3. En el primer inicio, si no hay URL, solicitamos la configuración base
    if (!backendUrl) {
        return <ConfigView onConfigured={setBackendUrl} />;
    }

    // Si el socket aún no termina de instanciarse, mostramos un pequeño loader
    if (!socket) {
        return <div className="flex h-screen items-center justify-center">Cargando conexión...</div>;
    }

    // 4. Una vez configurada la URL y el socket listo, renderizamos la aplicación
    return (
        <div className="min-h-screen bg-base-200">
            <header className="p-4 bg-white shadow flex justify-between items-center">
                <h1 className="font-bold text-xl">Pokémon Stadium Lite</h1>
                <div className="text-sm font-semibold">
                    {isConnected ? (
                        <span className="text-green-600">🟢 Conectado</span>
                    ) : (
                        <span className="text-red-600">🔴 Desconectado</span>
                    )}
                </div>
            </header>

            <main className="p-4">
                <LobbyView socket={socket} />
            </main>
        </div>
    );
}

export default App;
