class PokemonService {
  constructor() {
    // URL base del servicio pokemon
    this.baseUrl = 'https://pokemon-api-92034153384.us-central1.run.app';
  }

  /**
   * Obtiene la lista general del catálogo de Pokémon.
   * Endpoint: GET /list
   */
  async getCatalog() {
    try {
      const response = await fetch(`${this.baseUrl}/list`);
      if (!response.ok) {
        throw new Error(`Error en la API de Pokémon: ${response.statusText}`);
      }
      const data = await response.json();
      return data; // Retorna el arreglo de Pokémon (ej. [{"id":1, "name": "Bulbasaur"}, ...])
    } catch (error) {
      console.error('Error en getCatalog:', error);
      throw new Error('No se pudo obtener el catálogo de Pokémon');
    }
  }

  /**
   * Obtiene el detalle completo de un Pokémon por su ID.
   * Endpoint: GET /list/:id
   */
  async getPokemonDetail(id) {
    try {
      const response = await fetch(`${this.baseUrl}/list/${id}`);
      if (!response.ok) {
        throw new Error(`Error en la API de Pokémon: ${response.statusText}`);
      }
      const res = await response.json();
      console.log(res)
      
      return res.data; 
    } catch (error) {
      console.error(`Error en getPokemonDetail para el ID ${id}:`, error);
      throw new Error('No se pudo obtener el detalle del Pokémon');
    }
  }
}

module.exports = PokemonService;