import { useState, useEffect } from 'react';

export default function BattleView({ socket, nickname, initialTurn }) {
    const [activeTurn, setActiveTurn] = useState(initialTurn);
    const [battleLogs, setBattleLogs] = useState(['¡La batalla ha comenzado!']);
    const [winner, setWinner] = useState(null);

    useEffect(()=> {
        if(initialTurn) {
            setActiveTurn(initialTurn);
        }
    }, [initialTurn]);

    useEffect(() => {
        if (!socket) return;

        // Escuchar el resultado de cada turno
        socket.on('turn_result', (data) => {
            setActiveTurn(data.nextTurn);

            // Construir las notificaciones
            const newLogs = [];
            newLogs.push(`Ataque realizado. Daño infligido: ${data.damageDealt}. HP restante del defensor: ${data.defenderRemainingHp}`);

            if (data.isDefeated) {
                newLogs.push('¡Un Pokémon ha sido derrotado!');
            }

            if (data.switchedPokemon) {
                newLogs.push('¡Un nuevo Pokémon ha entrado a la batalla!');
            }

            // Actualizar el historial de notificaciones
            setBattleLogs((prev) => [...prev, ...newLogs]);
        });

        // Escuchar el final de la batalla
        socket.on('battle_end', (data) => {
            setWinner(data.winner);
            setBattleLogs((prev) => [...prev, `¡La batalla ha terminado! El ganador es ${data.winner}`]);
        });

        return () => {
            socket.off('turn_result');
            socket.off('battle_end');
        };
    }, [socket]);

    // Disparar el evento de ataque hacia el servidor
    const handleAttack = () => {
        // Solo puede atacar si es su turno
        if (activeTurn === nickname && !winner) {
            socket.emit('attack', { lobbyId: 'SINGLE_LOBBY', nickname });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold text-center mb-6">⚔️ Campo de Batalla ⚔️</h2>

            {/* Pantalla de Victoria */}
            {winner && (
                <div className="alert alert-success shadow-lg mb-6 text-2xl font-bold justify-center">
                    🏆 ¡EL GANADOR ES {winner.toUpperCase()}! 🏆
                </div>
            )}

            {/* Indicador de Turno */}
            {!winner && (
                <div className={`alert shadow-lg mb-6 justify-center text-xl font-semibold ${activeTurn === nickname ? 'alert-info' : 'alert-warning'}`}>
                    {activeTurn === nickname ? '👉 ¡ES TU TURNO!' : `Esperando el ataque de ${activeTurn}...`}
                </div>
            )}

            <div className="card bg-base-100 shadow-xl border p-6 flex flex-col items-center">
                {/* El ataque se dispara mediante un botón */}
                <button
                    className="btn btn-error btn-lg w-1/2 mb-8 text-white"
                    onClick={handleAttack}
                    disabled={activeTurn !== nickname || winner !== null}
                >
                    💥 ATACAR 💥
                </button>

                {/* Registro de Notificaciones */}
                <div className="w-full bg-gray-100 rounded p-4 h-64 overflow-y-auto border">
                    <h3 className="font-bold border-b pb-2 mb-2">Historial de Batalla</h3>
                    <ul className="space-y-2 text-sm font-mono">
                        {battleLogs.map((log, index) => (
                            <li key={index} className="p-2 bg-white rounded shadow-sm border-l-4 border-blue-500">
                                {log}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}