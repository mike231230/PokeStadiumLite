import { useState, useEffect } from 'react';

export default function ConfigView({ onConfigured }) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        // Revisamos si ya hay una URL guardada localmente en el primer inicio
        const savedUrl = localStorage.getItem('backendUrl');
        if (savedUrl) {
            onConfigured(savedUrl);
        }
    }, [onConfigured]);

    const handleSave = () => {
        if (url) {
            // Guardamos la URL localmente para usarla en la conexión de red
            localStorage.setItem('backendUrl', url);
            onConfigured(url);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <div className="max-w-md w-full border rounded shadow-lg p-6 bg-white">
                <h2 className="text-xl font-bold mb-4">Configuración del Servidor</h2>
                <p className="mb-4 text-sm text-gray-600">
                    Por favor, ingresa la URL base del backend (ej. http://192.168.X.X:8080)[cite: 1]:
                </p>
                <input
                    type="text"
                    placeholder="http://localhost:8080"
                    className="border p-2 w-full mb-4 rounded"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
                    onClick={handleSave}
                >
                    Guardar y Continuar
                </button>
            </div>
        </div>
    );
}