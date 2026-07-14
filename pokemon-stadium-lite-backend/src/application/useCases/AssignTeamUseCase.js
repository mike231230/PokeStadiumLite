const Pokemon = require('../../domain/entities/Pokemon')

class AssignTeamUseCase {
  /**
   * @param {Object} lobbyRepository - Contrato para buscar y guardar el Lobby en la base de datos.
   * @param {Object} pokemonService - Contrato para consultar la API externa de Pokémon.
   */
  constructor(lobbyRepository, pokemonService) {
    this.lobbyRepository = lobbyRepository;
    this.pokemonService = pokemonService;
  }

  async execute(lobbyId, nickname) {
    // 1. Obtener el lobby actual desde la base de datos
    const lobby = await this.lobbyRepository.getById(lobbyId);
    if (!lobby) {
      throw new Error('Lobby no encontrado');
    }

    // 2. Encontrar al jugador que solicitó el equipo
    const player = lobby.players.find(p => p.nickname === nickname);
    if (!player) {
      throw new Error('Jugador no encontrado en este lobby');
    }

    // 3. Obtener la lista completa de Pokémon desde la API externa
    const catalog = await this.pokemonService.getCatalog(); // Llama a GET /list

    // 4. Identificar qué Pokémon ya están en uso por el otro jugador
    const otherPlayer = lobby.players.find(p => p.nickname !== nickname);
    const usedPokemonIds = otherPlayer ? otherPlayer.team.map(p => p.id) : [];

    // 5. Filtrar el catálogo para no repetir Pokémon entre jugadores
    const availablePokemons = catalog.data.filter(p => !usedPokemonIds.includes(p.id));

    // 6. Seleccionar 3 Pokémon al azar
    const selectedPokemonsInfo = this._getRandomElements(availablePokemons, 3);

    // 7. Obtener el detalle de cada Pokémon seleccionado para traer sus estadísticas (HP, Attack, etc.)
    // Llama a GET /list/:id para cada uno
    const detailedPokemons = await Promise.all(
      selectedPokemonsInfo.map(info => this.pokemonService.getPokemonDetail(info.id))
    );

    const pokemonInstances = detailedPokemons.map(apiData => new Pokemon(apiData))

    // 8. El caso de uso orquesta, pero la entidad Player hace la asignación
    player.assignTeam(pokemonInstances);

    // 9. Guardar los cambios en la base de datos
    await this.lobbyRepository.save(lobby);

    return lobby;
  }

  /**
   * Método auxiliar privado para obtener elementos aleatorios de un arreglo.
   */
  _getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

module.exports = AssignTeamUseCase;