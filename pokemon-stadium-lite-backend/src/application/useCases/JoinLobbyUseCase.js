const Player = require('../../domain/entities/Player');
const Lobby = require('../../domain/entities/Lobby');

class JoinLobbyUseCase {
  /**
   * @param {Object} lobbyRepository - Contrato para la base de datos.
   */
  constructor(lobbyRepository) {
    this.lobbyRepository = lobbyRepository;
  }

  async execute(nickname) {
    // ID estático
    const LOBBY_ID = 'SINGLE_LOBBY';
    
    // Buscamos si el lobby ya existe en la base de datos
    let lobby = await this.lobbyRepository.getById(LOBBY_ID);

    // Si no existe (es el primer jugador en entrar), crea el lobby
    if (!lobby) {
      lobby = new Lobby(LOBBY_ID);
    }

    // Un jugador puede entrar al lobby solo con su apodo de entrenador
    const newPlayer = new Player(nickname);

    // Intentamos agregar al jugador al lobby
    const added = lobby.addPlayer(newPlayer);
    
    // Si el método devuelve false, significa que ya hay 2 jugadores
    if (!added) {
      throw new Error('El lobby ya está lleno. Solo se permiten 2 jugadores a la vez.');
    }

    // Guardamos el estado del lobby actualizado
    await this.lobbyRepository.save(lobby);

    return lobby;
  }
}

module.exports = JoinLobbyUseCase;