// Texas Hold'em logic
type Suit = 0 | 1 | 2 | 3; // hearts, diamonds, clubs, spades
type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // 1 for ace low, 14 for ace high
type GamePhase = "preflop" | "flop" | "turn" | "river" | "showdown";
type PlayerAction = "fold" | "check" | "call" | "raise";

interface Card {
  value: Value;
  suit: Suit;
  displayValue: string;
  displaySuit: string;
}

interface Player {
  id: number;
  chips: number;
  cards: Card[];
  bet: number;
  totalBet: number;
  folded: boolean;
  acted: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  allIn: boolean;
}

interface Pot {
  amount: number;
  players: number[]; // players eligible for this pot
}

interface GameState {
  deck: Card[];
  players: Player[];
  pots: Pot[];
  communityCards: Card[];
  currentBet: number;
  phase: GamePhase;
  activePlayer: number;
  lastRaiser: number | null;
  smallBlind: number;
  bigBlind: number;
  minRaise: number;
  dealerPosition: number;
}

interface HandRank {
  rank: number;
  name: string;
  values: number[];
}

const CARD_VALUES: Record<number, string> = {
  1: "A",
  11: "J",
  12: "Q",
  13: "K",
  14: "A", // ace high
};

const SUIT_DISPLAY: string[] = ["hearts", "diamonds", "clubs", "spades"];

// creates standard 52 card deck
function createDeck(): Card[] {
  const deck: Card[] = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let value = 1; value <= 13; value++) {
      deck.push({
        value: value as Value,
        suit: suit as Suit,
        displayValue: CARD_VALUES[value] || value.toString(),
        displaySuit: SUIT_DISPLAY[suit],
      });
    }
  }
  return shuffle(deck);
}

// shuffles the deck
function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// initializes a new game with players and starting chips
function initGame(playerCount: number, startingChips = 1000): GameState {
  const players: Player[] = Array(playerCount)
    .fill(null)
    .map((_, i) => ({
      id: i,
      chips: startingChips,
      cards: [],
      bet: 0,
      totalBet: 0,
      folded: false,
      acted: false,
      isDealer: i === 0,
      isSmallBlind: i === 1,
      isBigBlind: i === 2,
      allIn: false,
    }));

  const game: GameState = {
    deck: createDeck(),
    players,
    pots: [],
    communityCards: [],
    currentBet: 0,
    phase: "preflop",
    activePlayer: 0, // to be set after posting blinds
    lastRaiser: null,
    smallBlind: 10,
    bigBlind: 20,
    minRaise: 20,
    dealerPosition: 0,
  };

  const withBlinds = postBlinds(game);
  const withCards = dealHoleCards(withBlinds);
  return withCards;
}

// gets the next active player starting from a position
function getNextPlayer(players: Player[], start: number): number {
  const playerCount = players.length;
  for (let i = 0; i < playerCount; i++) {
    const idx = (start + i) % playerCount;
    if (!players[idx].folded && players[idx].chips > 0) {
      return idx;
    }
  }
  throw new Error("no active players found");
}

// posts blinds at the start of the hand
function postBlinds(game: GameState): GameState {
  const newGame = { ...game };
  const players = newGame.players;

  const smallBlindPosition = (newGame.dealerPosition + 1) % players.length;
  const bigBlindPosition = (newGame.dealerPosition + 2) % players.length;

  const smallBlindPlayer = players[smallBlindPosition];
  const smallBlindAmount = Math.min(newGame.smallBlind, smallBlindPlayer.chips);
  smallBlindPlayer.chips -= smallBlindAmount;
  smallBlindPlayer.bet += smallBlindAmount;
  smallBlindPlayer.totalBet += smallBlindAmount;
  smallBlindPlayer.allIn = smallBlindPlayer.chips === 0;

  const bigBlindPlayer = players[bigBlindPosition];
  const bigBlindAmount = Math.min(newGame.bigBlind, bigBlindPlayer.chips);
  bigBlindPlayer.chips -= bigBlindAmount;
  bigBlindPlayer.bet += bigBlindAmount;
  bigBlindPlayer.totalBet += bigBlindAmount;
  bigBlindPlayer.allIn = bigBlindPlayer.chips === 0;

  newGame.pots = [
    {
      amount: smallBlindAmount + bigBlindAmount,
      players: players.map((p) => p.id),
    },
  ];
  newGame.currentBet = bigBlindAmount;
  newGame.minRaise = newGame.bigBlind;

  // set active player to player after big blind
  newGame.activePlayer = (bigBlindPosition + 1) % players.length;

  return newGame;
}

// deals two hole cards to each player
function dealHoleCards(game: GameState): GameState {
  const newGame = { ...game };
  newGame.players.forEach((player) => {
    if (!player.folded && player.chips > 0) {
      player.cards = [newGame.deck.pop()!, newGame.deck.pop()!];
    }
  });
  return newGame;
}

// handles player actions - fold, check, call, raise
function handleAction(
  game: GameState,
  playerId: number,
  action: PlayerAction,
  amount = 0
): GameState {
  if (playerId !== game.activePlayer) throw new Error("not your turn");

  const player = game.players[playerId];
  if (player.folded || player.allIn) return game;

  const newGame = { ...game };
  const currentPlayer = newGame.players[playerId];

  switch (action) {
    case "fold":
      currentPlayer.folded = true;
      break;

    case "check":
      if (newGame.currentBet > currentPlayer.bet)
        throw new Error("can't check");
      break;

    case "call":
      const callAmount = Math.min(
        newGame.currentBet - currentPlayer.bet,
        currentPlayer.chips
      );
      if (callAmount === currentPlayer.chips) currentPlayer.allIn = true;
      currentPlayer.chips -= callAmount;
      currentPlayer.bet += callAmount;
      currentPlayer.totalBet += callAmount;
      addToPot(newGame, callAmount);
      break;

    case "raise":
      if (amount < newGame.minRaise) throw new Error("raise too small");

      let raiseAmount = newGame.currentBet + amount - currentPlayer.bet;

      if (raiseAmount > currentPlayer.chips) {
        raiseAmount = currentPlayer.chips;
        currentPlayer.allIn = true;
      }

      currentPlayer.chips -= raiseAmount;
      currentPlayer.bet += raiseAmount;
      currentPlayer.totalBet += raiseAmount;
      newGame.currentBet = currentPlayer.bet;
      newGame.minRaise = amount;
      newGame.lastRaiser = playerId;
      addToPot(newGame, raiseAmount);

      // reset acted for other players
      newGame.players.forEach((p) => {
        if (!p.folded && !p.allIn && p.id !== playerId) {
          p.acted = false;
        }
      });
      break;
  }

  currentPlayer.acted = true;
  return advanceGame(newGame);
}

// adds amount to the main pot
function addToPot(game: GameState, amount: number): void {
  if (game.pots.length === 0) {
    game.pots.push({
      amount: amount,
      players: game.players.map((p) => p.id),
    });
  } else {
    game.pots[0].amount += amount;
  }
}

// advances the game to next player or phase
function advanceGame(game: GameState): GameState {
  const activePlayers = game.players.filter((p) => !p.folded && p.chips > 0);

  // check if only one player left
  if (activePlayers.length === 1) {
    return resolveHand(game);
  }

  // check if betting round is complete
  const needAction = activePlayers.filter((p) => !p.acted && !p.allIn);
  if (needAction.length === 0) {
    return nextPhase(game);
  }

  // find next active player
  let nextPlayer = (game.activePlayer + 1) % game.players.length;
  while (
    game.players[nextPlayer].folded ||
    game.players[nextPlayer].allIn ||
    game.players[nextPlayer].chips === 0
  ) {
    nextPlayer = (nextPlayer + 1) % game.players.length;
  }
  game.activePlayer = nextPlayer;

  return game;
}

// moves game to next phase and deals community cards
function nextPhase(game: GameState): GameState {
  const phases: GamePhase[] = ["preflop", "flop", "turn", "river", "showdown"];
  const currentIndex = phases.indexOf(game.phase);

  if (currentIndex === phases.length - 1) {
    return resolveHand(game);
  }

  const newGame = { ...game };
  newGame.phase = phases[currentIndex + 1] as GamePhase;
  newGame.currentBet = 0;
  newGame.minRaise = newGame.bigBlind;

  // deal community cards
  if (newGame.phase === "flop") {
    newGame.communityCards.push(
      newGame.deck.pop()!,
      newGame.deck.pop()!,
      newGame.deck.pop()!
    );
  } else if (newGame.phase === "turn" || newGame.phase === "river") {
    newGame.communityCards.push(newGame.deck.pop()!);
  }

  // reset bets and acted status
  newGame.players.forEach((p) => {
    p.bet = 0;
    p.acted = false;
  });

  // set next active player
  newGame.activePlayer = getNextPlayer(
    newGame.players,
    (newGame.dealerPosition + 1) % newGame.players.length
  );

  return newGame;
}

// resolves the hand and distributes the pot
function resolveHand(game: GameState): GameState {
  const activePlayers = game.players.filter((p) => !p.folded && p.chips > 0);
  const winners = getWinners(activePlayers, game.communityCards);

  // distribute pot among winners
  const potAmount = game.pots.reduce((sum, pot) => sum + pot.amount, 0);
  const winAmount = Math.floor(potAmount / winners.length);
  winners.forEach((winner) => {
    winner.chips += winAmount;
  });

  // reset for next hand
  return resetHand(game);
}

// resets the hand for the next round
function resetHand(game: GameState): GameState {
  const newDealer = (game.dealerPosition + 1) % game.players.length;
  const newPlayers = game.players.map((p) => ({
    ...p,
    cards: [],
    bet: 0,
    acted: false,
    folded: false,
  }));

  return {
    deck: shuffle(createDeck()),
    players: newPlayers,
    pots: [],
    communityCards: [],
    currentBet: 0,
    phase: "preflop",
    activePlayer: (newDealer + 2) % newPlayers.length, // player after big blind
    lastRaiser: null,
    smallBlind: game.smallBlind,
    bigBlind: game.bigBlind,
    minRaise: game.bigBlind,
    dealerPosition: newDealer,
  };
}

// determines the winning player(s)
function getWinners(players: Player[], communityCards: Card[]): Player[] {
  const ranked = players
    .map((player) => ({
      player,
      handRank: evaluateHand([...player.cards, ...communityCards]),
    }))
    .sort((a, b) => compareHands(b.handRank, a.handRank));

  const bestRank = ranked[0].handRank;
  return ranked
    .filter((p) => compareHands(p.handRank, bestRank) === 0)
    .map((p) => p.player);
}

// evaluates the strength of a hand
function evaluateHand(cards: Card[]): HandRank {
  const values = cards.map((c) => c.value).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);

  const isFlush = suits.every((s) => s === suits[0]);
  const isStraight = checkStraight(values);
  const groups = getGroups(values);

  if (isFlush && isStraight && values[0] === 14)
    return { rank: 9, name: "royal flush", values };
  if (isFlush && isStraight) return { rank: 8, name: "straight flush", values };
  if (groups[0] === 4) return { rank: 7, name: "four of a kind", values };
  if (groups[0] === 3 && groups[1] === 2)
    return { rank: 6, name: "full house", values };
  if (isFlush) return { rank: 5, name: "flush", values };
  if (isStraight) return { rank: 4, name: "straight", values };
  if (groups[0] === 3) return { rank: 3, name: "three of a kind", values };
  if (groups[0] === 2 && groups[1] === 2)
    return { rank: 2, name: "two pair", values };
  if (groups[0] === 2) return { rank: 1, name: "pair", values };
  return { rank: 0, name: "high card", values };
}

// checks if the values form a straight
function checkStraight(values: number[]): boolean {
  const uniqueValues = Array.from(new Set(values)).sort((a, b) => b - a);
  // check high ace straight
  if (uniqueValues.length >= 5) {
    for (let i = 0; i <= uniqueValues.length - 5; i++) {
      const slice = uniqueValues.slice(i, i + 5);
      if (isSequential(slice)) return true;
    }
  }

  // check ace low straight
  if (uniqueValues.includes(14)) {
    const aceLow = [5, 4, 3, 2, 1];
    if (aceLow.every((val) => uniqueValues.includes(val))) return true;
  }

  return false;
}

// checks if the array is sequential
function isSequential(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] - arr[i + 1] !== 1) return false;
  }
  return true;
}

// groups the card values
function getGroups(values: number[]): number[] {
  const counts: Record<number, number> = {};
  values.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
  });
  return Object.values(counts).sort((a, b) => b - a);
}

// compares two hands
function compareHands(hand1: HandRank, hand2: HandRank): number {
  if (hand1.rank !== hand2.rank) return hand1.rank - hand2.rank;
  for (let i = 0; i < hand1.values.length; i++) {
    if (hand1.values[i] !== hand2.values[i]) {
      return hand1.values[i] - hand2.values[i];
    }
  }
  return 0;
}

export { initGame, handleAction };
export type { GameState, Player, Card };
