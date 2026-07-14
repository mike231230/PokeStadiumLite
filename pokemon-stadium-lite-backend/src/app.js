const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

//  Importar Infraestructura 
const PokemonService = require('./infra/externalApis/PokemonService');
const LobbyRepository = require('./infra/repositories/LobbyRepository');

//  Importar Casos de Uso (Aplicación) 
const JoinLobbyUseCase = require('./application/useCases/JoinLobbyUseCase');
const AssignTeamUseCase = require('./application/useCases/AssignTeamUseCase');
const ReadyPlayerUseCase = require('./application/useCases/ReadyPlayerUseCase');
const ExecuteAttackUseCase = require('./application/useCases/ExecuteAttackUseCase');

// Importar Controladores (Interfaces) 
const LobbyController = require('./interfaces/controllers/LobbyController');

//  Inicializar Express y Servidor HTTP 
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Habilitar CORS para conectar con React
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 1. Instanciar Infraestructura
const pokemonService = new PokemonService();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const lobbyRepository = new LobbyRepository(MONGO_URI);

// 2. Instanciar Casos de Uso 
const joinLobbyUC = new JoinLobbyUseCase(lobbyRepository);
const assignTeamUC = new AssignTeamUseCase(lobbyRepository, pokemonService);
const readyPlayerUC = new ReadyPlayerUseCase(lobbyRepository);
const executeAttackUC = new ExecuteAttackUseCase(lobbyRepository);

// 3. Instanciar el Controlador 
const lobbyController = new LobbyController(
  joinLobbyUC, 
  assignTeamUC, 
  readyPlayerUC, 
  executeAttackUC
);


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Escuchar los eventos esperados desde el cliente
  
  socket.on('join_lobby', (nickname) => {
    lobbyController.handleJoinLobby(socket, io, nickname);
  });

  socket.on('assign_pokemon', (data) => {
    lobbyController.handleAssignPokemon(socket, io, data);
  });

  socket.on('ready', (data) => {
    lobbyController.handleReady(socket, io, data);
  });

  socket.on('attack', (data) => {
    lobbyController.handleAttack(socket, io, data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar el Servidor 
const startServer = async () => {
  try {
    await lobbyRepository.connect();

    server.listen(PORT, HOST, () => {
      console.log(`Servidor de Pokémon Stadium Lite corriendo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
