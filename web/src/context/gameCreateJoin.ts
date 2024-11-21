export interface Player {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
}
const games: Game[] = [];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Create a new game
export function createGame(name: string, maxPlayers: number): Game {
  if (maxPlayers < 2) {
    throw new Error("A game must have at least 2 players.");
  }
  const newGame: Game = {
    id: generateId(),
    name,
    players: [],
    maxPlayers,
  };
  games.push(newGame);
  return newGame;
}
export function getAllGames(): Game[] {
  return [...games];
}

// Join a game
export function joinGame(gameId: string, player: Player): void {
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  // Check if the game is full
  if (game.players.length >= game.maxPlayers) {
    throw new Error("Game is full. Cannot join.");
  }

  const isJoined = game.players.some((p) => p.id === player.id);
  if (isJoined) {
    throw new Error("Player already in the game");
  }

  game.players.push(player);
}

// Leave a game
export function leaveGame(gameId: string, playerId: string): void {
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    throw new Error("Player not in the game");
  }

  game.players.splice(playerIndex, 1);
}

// Check if a game is full
export function isGameFull(gameId: string): boolean {
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    throw new Error("Game not found");
  }
  return game.players.length >= game.maxPlayers;
}
