import { useState, useEffect } from 'react';
import BattleView from "./BattleView.jsx";

export default function LobbyView({ socket }) {
    const [nickname, setNickname] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [lobbyStatus, setLobbyStatus] = useState('waiting');
    const [myPlayerInfo, setMyPlayerInfo] = useState(null);
    const [opponentInfo, setOpponentInfo] = useState(null);

    const [activeTurn, setActiveTurn] = useState(null);

    useEffect(() => {
        if (!socket) return;

        // Sincroniza el estado actual del lobby con todos los jugadores conectados
        socket.on('lobby_status', (data) => {
            // Si el backend envía el objeto completo del lobby
            if (data.status) setLobbyStatus(data.status);

            if (data.activeTurnPlayer) {
                setActiveTurn(data.activeTurnPlayer);
            }

            // Separamos y guardamos a ambos jugadores en el estado de React
            if (data.players) {
                const me = data.players.find(p => p.nickname === nickname);
                if (me) setMyPlayerInfo(me);

                const rival = data.players.find(p => p.nickname !== nickname);
                if (rival) setOpponentInfo(rival);
            }
        });
        socket.on('error', (errorData) => {
            alert(`Error del servidor: ${errorData.message}`);
            console.error("Socket Error:", errorData);
        });
        socket.on('battle_start', (data) => {
            setActiveTurn(data.activeTurnPlayer);
            setLobbyStatus('battling');

        })

        return () => {
            socket.off('lobby_status');
            socket.off('battle_start');
            socket.off('error');
        };
    }, [socket, nickname]);

    // 1. Ingresar al lobby solo con el apodo
    const handleJoin = () => {
        if (nickname.trim()) {
            socket.emit('join_lobby', nickname);
            setHasJoined(true);
        }
    };

    // 2. Solicitar la asignación de 3 Pokémon aleatorios
    const handleAssignTeam = () => {
        socket.emit('assign_pokemon', { lobbyId: 'SINGLE_LOBBY', nickname });
    };

    // 3. Confirmar que el equipo está listo para la batalla
    const handleReady = () => {
        socket.emit('ready', { lobbyId: 'SINGLE_LOBBY', nickname });
    };




    if(lobbyStatus === 'battling' || lobbyStatus === 'finished') {
        return(
            <BattleView socket={socket} nickname={nickname} initialTurn={activeTurn} lobbyId="SINGLE_LOBBY" myPlayer={myPlayerInfo} opponentPlayer={opponentInfo} />
        )
    }

    // Pantalla 1: Ingreso de Apodo
    if (!hasJoined) {
        return (
            <div className="flex flex-col items-center justify-center h-full mt-20">
                <div className="card w-96 bg-base-100 shadow-xl border p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Entrar al Lobby</h2>
                    <input
                        type="text"
                        placeholder="Ingresa tu apodo de entrenador"
                        className="input input-bordered w-full mb-4"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <button className="btn btn-primary w-full" onClick={handleJoin}>
                        Unirse
                    </button>
                </div>
            </div>
        );
    }

    // Pantalla 2: Lobby y Selección de Equipo
    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-3xl font-bold">Lobby</h2>
                <div className="badge badge-outline text-lg p-4 uppercase">
                    Estado: {lobbyStatus}
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl border p-6">
                <h3 className="text-xl font-bold mb-4">Entrenador: {nickname}</h3>

                {/* Mostrar el equipo si ya fue asignado */}
                {myPlayerInfo?.team && myPlayerInfo.team.length > 0 ? (
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Tu Equipo Pokémon:</h4>
                        <div className="flex gap-4">
                            {myPlayerInfo.team.map((pokemon) => (
                                <div key={pokemon.id} className="border rounded p-4 flex flex-col items-center w-1/3 shadow-sm">
                                    <img src={pokemon.sprite} alt={pokemon.name} className="h-24 w-24 object-contain" />
                                    <span className="font-bold">{pokemon.name}</span>
                                    <span className="text-sm text-gray-500">HP: {pokemon.hp} | Atk: {pokemon.attack}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 text-gray-500 italic">
                        Aún no tienes un equipo asignado.
                    </div>
                )}

                {/* Botones de Acción */}
                <div className="flex gap-4">
                    <button
                        className="btn btn-secondary flex-1"
                        onClick={handleAssignTeam}
                        disabled={myPlayerInfo?.team?.length > 0} // Deshabilitar si ya tiene equipo
                    >
                        Obtener Equipo Aleatorio
                    </button>

                    <button
                        className="btn btn-accent flex-1"
                        onClick={handleReady}
                        disabled={!myPlayerInfo?.team?.length || myPlayerInfo?.isReady} // Deshabilitar si no tiene equipo o ya está listo
                    >
                        {myPlayerInfo?.isReady ? 'Esperando al rival...' : 'Confirmar y Listo'}
                    </button>
                </div>
            </div>
        </div>
    );
}