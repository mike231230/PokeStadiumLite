class Lobby {
  constructor(id) {
    this.id = id;
    this.players = []; 
    this.status = 'waiting'; 
    this.activeTurnPlayer = null; 
    this.winner = null; 
  }

  /**
   * Agrega un jugador al lobby si hay espacio.
   * @param {Object} player - Instancia de la clase Player.
   * @returns {boolean} True si se agregó con éxito, False si el lobby está lleno.
   */
  addPlayer(player) {
    // El lobby permite 2 jugadores a la vez
    if (this.players.length == 2) {
      return false; 
    }
    this.players.push(player);
    return true;
  }

  /**
   * Verifica si ambos jugadores están listos y actualiza el estado.
   */
  checkReadyStatus() {
    if (this.players.length === 2 && this.players.every(p => p.isReady)) {
      this.status = 'ready'; // Ambos jugadores están listos
    }
  }

  /**
   * Inicia la batalla, cambiando el estado y determinando el primer turno.
   */
  startBattle() {
    if (this.status !== 'ready') return;

    this.status = 'battling'; // La batalla ha comenzado

    const player1 = this.players[0];
    const player2 = this.players[1];

    const p1Speed = player1.getActivePokemon().speed;
    const p2Speed = player2.getActivePokemon().speed;

    // El primer turno se asigna al jugador cuyo Pokémon activo tenga la mayor Velocidad
    if (p1Speed >= p2Speed) {
      this.activeTurnPlayer = player1.nickname;
    } else {
      this.activeTurnPlayer = player2.nickname;
    }
  }

  /**
   * Cambia el turno al siguiente jugador .
   */
  switchTurn() {
    const player1 = this.players[0];
    const player2 = this.players[1];

    if (this.activeTurnPlayer === player1.nickname) {
      this.activeTurnPlayer = player2.nickname;
    } else {
      this.activeTurnPlayer = player1.nickname;
    }
  }

  /**
   * Finaliza la batalla y declara al ganador.
   * @param {string} winnerNickname - Apodo del ganador.
   */
  endBattle(winnerNickname) {
    this.status = 'finished'; // Hay un ganador y la batalla ha terminado
    this.winner = winnerNickname;
  }
}

module.exports = Lobby;