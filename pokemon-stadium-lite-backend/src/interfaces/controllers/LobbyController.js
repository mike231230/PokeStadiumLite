class LobbyController {
  constructor(joinLobbyUC, assignTeamUC, readyPlayerUC, executeAttackUC) {
    this.joinLobbyUC = joinLobbyUC;
    this.assignTeamUC = assignTeamUC;
    this.readyPlayerUC = readyPlayerUC;
    this.executeAttackUC = executeAttackUC;
  }

  /**
   * Maneja el evento 'join_lobby'
   */
  async handleJoinLobby(socket, io, nickname) {
    try {
      const lobby = await this.joinLobbyUC.execute(nickname);
      
      // Unimos el socket a una sala específica del lobby
      socket.join(lobby.id);
      
      // Emitimos el estado actual a todos en el lobby: 'lobby_status'
      io.to(lobby.id).emit('lobby_status', lobby);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  /**
   * Maneja el evento 'assign_pokemon'
   */
  async handleAssignPokemon(socket, io, data) {
    try {
      const { lobbyId, nickname } = data;
      console.log(`⏳ Solicitando equipo Pokémon para el jugador: ${nickname}...`);
      const updatedLobby = await this.assignTeamUC.execute(lobbyId, nickname);

      console.log(`✅ Equipo asignado exitosamente a ${nickname}. Sincronizando frontend...`);
      
      io.to(lobbyId).emit('lobby_status', updatedLobby);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  /**
   * Maneja el evento 'ready'
   */
  async handleReady(socket, io, data) {
    try {
      const { lobbyId, nickname } = data;
      const result = await this.readyPlayerUC.execute(lobbyId, nickname);
      
      // Sincroniza el estado del lobby
      io.to(lobbyId).emit('lobby_status', { 
        status: result.lobbyStatus,
        activeTurnPlayer: result.activeTurnPlayer

      });

      // Si ambos jugadores están listos, se emite 'battle_start'
      if (result.battleStarted) {
        io.to(lobbyId).emit('battle_start', { activeTurnPlayer: result.activeTurnPlayer });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  /**
   * Maneja el evento 'attack'
   */
  async handleAttack(socket, io, data) {
    try {
      const { lobbyId, nickname } = data;
      const result = await this.executeAttackUC.execute(lobbyId, nickname);

      // Emite el resultado del turno con el daño y HP actualizado: 'turn_result'
      io.to(lobbyId).emit('turn_result', result);

      io.to(lobbyId).emit('lobby_status', result.lobby)

      // Si la batalla terminó, emite 'battle_end'
      if (result.battleEnded) {
        io.to(lobbyId).emit('battle_end', { winner: result.winner });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }
}

module.exports = LobbyController;