
class ReadyPlayerUseCase {
  /**
   * @param {Object} lobbyRepository - Contrato para la base de datos.
   */
  constructor(lobbyRepository) {
    this.lobbyRepository = lobbyRepository;
  }

  async execute(lobbyId, nickname) {
    // 1. Obtener el lobby
    const lobby = await this.lobbyRepository.getById(lobbyId);
    if (!lobby) throw new Error('Lobby no encontrado');

    // 2. Buscar al jugador
    const player = lobby.players.find(p => p.nickname === nickname);
    if (!player) throw new Error('Jugador no encontrado');

    // 3. Confirmar que está listo
    player.markAsReady();

    // 4. El lobby verifica si ambos jugadores están marcados como listos
    lobby.checkReadyStatus();

    let battleStarted = false;

    // 5. Una vez que los dos jugadores están listos, el sistema debe iniciar automáticamente la batalla
    if (lobby.status === 'ready') {
      // Este método cambia el estado a 'battling' y calcula quién tiene el primer turno según la Velocidad
      lobby.startBattle(); 
      battleStarted = true;
    }

    // 6. Guardar cambios
    await this.lobbyRepository.save(lobby);

    // 7. Retornar información para que el controlador emita 'battle_start' si aplica
    return {
      lobbyStatus: lobby.status, // Será 'battling' si ambos están listos
      battleStarted,
      activeTurnPlayer: lobby.activeTurnPlayer
    };
  }
}

module.exports = ReadyPlayerUseCase;