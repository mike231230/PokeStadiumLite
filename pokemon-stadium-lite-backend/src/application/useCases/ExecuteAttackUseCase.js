class ExecuteAttackUseCase {
  /**
   * @param {Object} lobbyRepository - Contrato para buscar y guardar el Lobby en la base de datos.
   */
  constructor(lobbyRepository) {
    this.lobbyRepository = lobbyRepository;
  }

  async execute(lobbyId, attackerNickname) {
    // 1. Obtener el lobby actual desde la base de datos
    const lobby = await this.lobbyRepository.getById(lobbyId);
    if (!lobby) throw new Error('Lobby no encontrado');

    // 2. Validar que la batalla esté en curso
    if (lobby.status !== 'battling') {
      throw new Error('La batalla no está en curso');
    }

    // 3. Validar que sea el turno del jugador atacante 
    if (lobby.activeTurnPlayer !== attackerNickname) {
      throw new Error('No es tu turno');
    }

    // 4. Identificar al atacante y al defensor
    const attackerPlayer = lobby.players.find(p => p.nickname === attackerNickname);
    const defenderPlayer = lobby.players.find(p => p.nickname !== attackerNickname);

    const attackerPokemon = attackerPlayer.getActivePokemon();
    const defenderPokemon = defenderPlayer.getActivePokemon();

    // 5. El dominio procesa el ataque atómicamente y calcula el daño
    const damageDealt = defenderPokemon.receiveAttack(attackerPokemon.attack);

    let isDefeated = defenderPokemon.isDefeated;
    let switchedPokemon = false;
    let battleEnded = false;

    // 6. Lógica de derrota y cambio de Pokémon
    if (isDefeated) {
      // Si el HP llega a 0, el siguiente Pokémon debe entrar automáticamente
      const hasNextPokemon = defenderPlayer.switchToNextPokemon();
      switchedPokemon = hasNextPokemon;

      // Si no quedan Pokémon restantes, la batalla termina
      if (!hasNextPokemon) {
        lobby.endBattle(attackerPlayer.nickname); // Se declara ganador al atacante
        battleEnded = true;
      }
    }

    // 7. Si la batalla no ha terminado, cambiamos el turno al siguiente jugador
    if (!battleEnded) {
      lobby.switchTurn();
    }

    // 8. Guardar el nuevo estado en la base de datos
    await this.lobbyRepository.save(lobby);

    // 9. Devolver un objeto con la información necesaria para los eventos WebSockets
    return {
      damageDealt,
      defenderRemainingHp: defenderPokemon.currentHp,
      isDefeated,
      switchedPokemon,
      battleEnded,
      winner: lobby.winner,
      nextTurn: lobby.activeTurnPlayer,
      lobby
    };
  }
}

module.exports = ExecuteAttackUseCase;