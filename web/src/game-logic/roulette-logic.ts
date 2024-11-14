//logic for Roulette, assumed we'd want to use the American version
// notes: game continues until either all players run out of chips or the player decides to leave
// each round follows a betting phase, spinning phase, and results phase and then a new round starts
// tracks how much money each players has, their betting history, their win/loss record, round results, and overall game stats
type Color = "red" | "black" | "green";
type BetType =
  | "number"
  | "color"
  | "even"
  | "odd"
  | "low"
  | "high"
  | "dozen"
  | "column";

// number config
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];
const GREEN_NUMBERS = [0, 37]; // 0 for 00, 37 for 0

// to track individual bets
interface Bet {
  playerId: number;
  type: BetType;
  amount: number;
  value: number | string;
}

// keeping track of each player's state and history
interface Player {
  id: number;
  chips: number;
  totalWinnings: number;
  totalLosses: number;
  bets: Bet[];
  active: boolean;
  history: {
    roundNumber: number;
    startingChips: number;
    endingChips: number;
    won: boolean;
  }[];
}

// main game state that tracks everything happening in the game
interface GameState {
  players: Player[];
  lastWinningNumber: number;
  isSpinning: boolean;
  roundNumber: number;
  bettingOpen: boolean;
  roundHistory: {
    roundNumber: number;
    winningNumber: number;
    playerResults: {
      playerId: number;
      startingChips: number;
      endingChips: number;
      bets: Bet[];
      won: boolean;
    }[];
  }[];
}

// gets the color of a number on the roulette wheel
function getNumberColor(number: number): Color {
  if (GREEN_NUMBERS.includes(number)) return "green";
  if (RED_NUMBERS.includes(number)) return "red";
  if (BLACK_NUMBERS.includes(number)) return "black";
  throw new Error("Invalid number");
}

// starts a new game
function initGame(playerCount: number, startingChips = 1000): GameState {
  const players = Array(playerCount)
    .fill(null)
    .map((_, i) => ({
      id: i,
      chips: startingChips,
      totalWinnings: 0,
      totalLosses: 0,
      bets: [],
      active: true,
      history: [],
    }));

  // init initial game state
  return {
    players,
    lastWinningNumber: -1,
    isSpinning: false,
    roundNumber: 1,
    bettingOpen: true,
    roundHistory: [],
  };
}

// starts a new round, clears previous bets and updates player status
function startNewRound(game: GameState): GameState {
  // check for which players are still active aka they aren't out of money
  game.players.forEach((player) => {
    player.active = player.chips > 0;
  });

  // makes sure we still have players who can play
  const activePlayers = game.players.filter((p) => p.active);
  if (activePlayers.length < 1) {
    throw new Error("Game over - no players with chips remaining");
  }

  // resets for new round while keeping player stats
  return {
    ...game,
    roundNumber: game.roundNumber + 1,
    lastWinningNumber: -1,
    isSpinning: false,
    bettingOpen: true,
    players: game.players.map((player) => ({
      ...player,
      bets: [],
    })),
  };
}

// place a bet for a player
function placeBet(
  game: GameState,
  playerId: number,
  type: BetType,
  amount: number,
  value: number | string
): GameState {
  // bet placement checks
  if (!game.bettingOpen) throw new Error("betting is closed");
  if (game.isSpinning) throw new Error("wheel is spinning");

  const player = game.players[playerId];
  if (!player.active) throw new Error("player is not active");
  if (player.chips < amount) throw new Error("not enough chips");

  // actually places the bet and updates player's chips
  player.chips -= amount;
  player.totalLosses += amount;
  player.bets.push({ playerId, type, amount, value });

  return { ...game };
}

// spins the wheel and resolves all bets
function spin(game: GameState): GameState {
  game.bettingOpen = false;
  game.isSpinning = true;

  // determine winning number (0-37)
  const winningNumber = Math.floor(Math.random() * 38);
  game.lastWinningNumber = winningNumber;

  // store the state before resolving bets
  const preSpinState = game.players.map((player) => ({
    playerId: player.id,
    startingChips: player.chips,
    bets: [...player.bets],
  }));

  // resolve all bets and update player states
  game.players.forEach((player) => {
    if (player.active) {
      const startingChips = player.chips;

      player.bets.forEach((bet) => {
        const winAmount = calculateWin(bet, winningNumber);
        if (winAmount > 0) {
          player.chips += winAmount;
          player.totalWinnings += winAmount;
        }
      });

      // record this round's results for the player
      player.history.push({
        roundNumber: game.roundNumber,
        startingChips: startingChips,
        endingChips: player.chips,
        won: player.chips > startingChips,
      });

      player.bets = [];
    }
  });

  // record the round results in game history
  game.roundHistory.push({
    roundNumber: game.roundNumber,
    winningNumber,
    playerResults: preSpinState.map((pre) => {
      const player = game.players.find((p) => p.id === pre.playerId)!;
      return {
        playerId: pre.playerId,
        startingChips: pre.startingChips,
        endingChips: player.chips,
        bets: pre.bets,
        won: player.chips > pre.startingChips,
      };
    }),
  });

  game.isSpinning = false;
  return startNewRound(game);
}

// calculates the winning amount for a bet
function calculateWin(bet: Bet, winningNumber: number): number {
  const won = checkWin(bet, winningNumber);
  if (!won) return 0;

  // standard roulette payout multipliers
  switch (bet.type) {
    case "number":
      return bet.amount * 35;
    case "color":
      return bet.amount * 2;
    case "even":
      return bet.amount * 2;
    case "odd":
      return bet.amount * 2;
    case "low":
      return bet.amount * 2;
    case "high":
      return bet.amount * 2;
    case "dozen":
      return bet.amount * 3;
    case "column":
      return bet.amount * 3;
    default:
      return 0;
  }
}

// checks if a bet is a winner
function checkWin(bet: Bet, winningNumber: number): boolean {
  switch (bet.type) {
    case "number":
      return winningNumber === Number(bet.value);

    case "color":
      return getNumberColor(winningNumber) === bet.value;

    case "even":
      return (
        winningNumber !== 0 && winningNumber !== 37 && winningNumber % 2 === 0
      );

    case "odd":
      return (
        winningNumber !== 0 && winningNumber !== 37 && winningNumber % 2 === 1
      );

    case "low":
      return winningNumber >= 1 && winningNumber <= 18;

    case "high":
      return winningNumber >= 19 && winningNumber <= 36;

    case "dozen":
      const dozen = Number(bet.value);
      const start = (dozen - 1) * 12 + 1;
      return winningNumber >= start && winningNumber < start + 12;

    case "column":
      const column = Number(bet.value);
      return winningNumber > 0 && winningNumber % 3 === column;

    default:
      return false;
  }
}

// stat tracking
function getPlayerStats(game: GameState, playerId: number) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  return {
    currentChips: player.chips,
    totalWinnings: player.totalWinnings,
    totalLosses: player.totalLosses,
    netProfit: player.totalWinnings - player.totalLosses,
    roundsPlayed: player.history.length,
    winningRounds: player.history.filter((h) => h.won).length,
    biggestWin: Math.max(
      ...player.history.map((h) => h.endingChips - h.startingChips)
    ),
    biggestLoss: Math.min(
      ...player.history.map((h) => h.endingChips - h.startingChips)
    ),
  };
}

// stats for a specific round
function getRoundStats(game: GameState, roundNumber: number) {
  const round = game.roundHistory.find((r) => r.roundNumber === roundNumber);
  if (!round) throw new Error("Round not found");

  return {
    winningNumber: round.winningNumber,
    totalBets: round.playerResults.reduce((sum, p) => sum + p.bets.length, 0),
    totalWinners: round.playerResults.filter((p) => p.won).length,
    biggestWin: Math.max(
      ...round.playerResults.map((p) => p.endingChips - p.startingChips)
    ),
  };
}

export {
  initGame,
  placeBet,
  spin,
  getPlayerStats,
  getRoundStats,
  getNumberColor,
};

export type { GameState, Player, Bet, Color, BetType };
