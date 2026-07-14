class Player {
  constructor(nickname) {
    this.nickname = nickname; // El jugador entra solo con su apodo
    this.team = []; // 
    this.isReady = false; 
    this.activePokemonIndex = 0; 
  }

  /**
   * Asigna el equipo de 3 Pokémon al jugador.
   * @param {Array} pokemonArray - Arreglo con 3 instancias de la clase Pokemon.
   */
  assignTeam(pokemonArray) {
    this.team = pokemonArray;
  }

  /**
   * Marca al jugador como listo para la batalla.
   */
  markAsReady() {
    this.isReady = true; // Permite saber cuándo el lobby puede pasar a 'battling'
  }

  /**
   * Obtiene el Pokémon que está peleando actualmente.
   * @returns {Object|null} La instancia del Pokémon activo o null si ya no tiene equipo.
   */
  getActivePokemon() {
    if (this.activePokemonIndex >= this.team.length) {
      return null;
    }
    return this.team[this.activePokemonIndex];
  }

  /**
   * Verifica si el jugador aún tiene Pokémon disponibles para pelear.
   * @returns {boolean}
   */
  hasAvailablePokemon() {
    // Busca si hay al menos un Pokémon en el equipo que no esté derrotado
    return this.team.some(pokemon => !pokemon.isDefeated);
  }

  /**
   * Cambia automáticamente al siguiente Pokémon si el actual fue derrotado.
   * @returns {boolean} True si pudo cambiar, False si ya no le quedan Pokémon.
   */
  switchToNextPokemon() {
    // Si el jugador tiene otro Pokémon disponible, este debe entrar automáticamente
    while (this.activePokemonIndex < this.team.length) {
      this.activePokemonIndex++;
      
      const nextPokemon = this.getActivePokemon();
      if (nextPokemon && !nextPokemon.isDefeated) {
        return true; // Se encontró y asignó un nuevo Pokémon válido
      }
    }
    return false; // No quedan Pokémon disponibles
  }
}

module.exports = Player;