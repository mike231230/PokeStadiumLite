import { useState, useEffect } from 'react';
import PokemonCard from "../components/PokemonCard.jsx";

export default function BattleView({ socket, nickname, initialTurn, lobbyId, myPlayer, opponentPlayer }) {
    const [activeTurn, setActiveTurn] = useState(initialTurn);
    const [battleLogs, setBattleLogs] = useState(['¡La batalla ha comenzado!']);
    const [winner, setWinner] = useState(null);

    const myActivePokemon = myPlayer?.team[myPlayer?.activePokemonIndex];
    const opponentActivePokemon = opponentPlayer?.team[opponentPlayer?.activePokemonIndex];

    const winnerTeam = winner === myPlayer?.nickname ? myPlayer?.team : opponentPlayer?.team;

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

            {/* --- PANTALLA DE VICTORIA --- */}
            {winner ? (
                <div className="flex flex-col items-center mb-8 bg-white p-8 rounded-xl shadow-2xl border-4 border-yellow-400">
                    <h2 className="text-4xl font-extrabold text-yellow-500 mb-2">🏆 ¡VICTORIA! 🏆</h2>
                    <p className="text-xl font-bold mb-8 text-gray-700">El campeón es {winner.toUpperCase()}</p>

                    <h3 className="font-bold text-lg mb-4 text-gray-500 tracking-widest">EQUIPO GANADOR</h3>
                    <div className="flex gap-6 w-full justify-center">
                        {winnerTeam?.map((poke) => (
                            <div key={poke.id} className="flex flex-col items-center border rounded-xl p-4 bg-base-50 shadow-md w-1/3">
                                <img
                                    src={poke.sprite}
                                    alt={poke.name}
                                    className={`h-24 w-24 object-contain ${poke.isDefeated ? 'grayscale opacity-50' : ''}`}
                                />
                                <span className="font-bold mt-2 uppercase">{poke.name}</span>
                                <span className={`text-sm font-bold ${poke.isDefeated ? 'text-red-500' : 'text-green-500'}`}>
                  {poke.isDefeated ? 'Derrotado' : `${poke.currentHp} HP`}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* --- INDICADOR DE TURNO Y ARENA (Solo se muestran si no hay ganador) --- */
                <>
                    <div className={`alert shadow-lg mb-6 justify-center text-xl font-semibold ${activeTurn === nickname ? 'alert-info' : 'alert-warning'}`}>
                        {activeTurn === nickname ? '👉 ¡ES TU TURNO!' : `Esperando el ataque de ${activeTurn}...`}
                    </div>

                    <div className="relative bg-white rounded-xl shadow-2xl border-4 border-gray-300 p-8 mb-8 overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col justify-between h-96">
                            <div className="flex justify-end w-full">
                                <PokemonCard pokemon={opponentActivePokemon} isOpponent={true} />
                            </div>
                            <div className="flex justify-start w-full -mt-20">
                                <PokemonCard pokemon={myActivePokemon} isOpponent={false} />
                            </div>
                        </div>
                    </div>
                </>
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