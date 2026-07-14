const {MongoClient} = require('mongodb')
const Lobby = require('../../domain/entities/Lobby');
const Player = require('../../domain/entities/Player');
const Pokemon = require('../../domain/entities/Pokemon');

class LobbyRepository {

  constructor(connectionString) {
    this.client = new MongoClient(connectionString);
    this.dbName = 'pokemon_stadium';
    this.collectionName = 'lobbies';
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection(this.collectionName);
    console.log('✅ Conectado a la base de datos MongoDB');
  }

  /**
   * Busca un lobby por su ID en la base de datos.
   * @param {string} id 
   * @returns {Object|null} La instancia del lobby o null si no existe.
   */
  async getById(id) {
    const data = await this.collection.findOne({ id });
    if (!data) return null;

    // 1. Rehidratar el Lobby
    const lobby = new Lobby(data.id);
    lobby.status = data.status; // status: waiting, ready, battling, finished
    lobby.activeTurnPlayer = data.activeTurnPlayer;
    lobby.winner = data.winner;

    // 2. Rehidratar a los Jugadores
    lobby.players = data.players.map(playerData => {
      const player = new Player(playerData.nickname);
      player.isReady = playerData.isReady;
      player.activePokemonIndex = playerData.activePokemonIndex;

      // 3. Rehidratar a los Pokémon y restaurar sus estados persistidos (HP, bandera de derrotado)
      const pokemons = playerData.team.map(pokeData => {
        const pokemon = new Pokemon({
          id: pokeData.id,
          name: pokeData.name,
          type: pokeData.type,
          hp: pokeData.maxHp, 
          attack: pokeData.attack,
          defense: pokeData.defense,
          speed: pokeData.speed,
          sprite: pokeData.sprite
        });
        
        // Restauramos el estado alterado en la batalla
        pokemon.currentHp = pokeData.currentHp;
        pokemon.isDefeated = pokeData.isDefeated;
        
        return pokemon;
      });

      player.assignTeam(pokemons);
      return player;
    });

    return lobby;
  }

  /**
   * Guarda o actualiza el estado del lobby en la base de datos.
   * @param {Object} lobbyInstance 
   */
  async save(lobbyInstance) {
    await this.collection.updateOne(
      { id: lobbyInstance.id },
      { $set: lobbyInstance },
      { upsert: true } 
    );
  }
}

module.exports = LobbyRepository;