
// import { createDeck, drawCard, shuffleDeck, addCardsToPile, listPile } from "./api";

const api = require('./api');
api.createDeck();
api.drawCard();
api.listPile();
api.shuffleDeck();
api.addCardsToPile();

export interface Card {
  code: string;
  value: string;
  suit: string;
  image: string;
}

export interface Pile {
  cards: Card[];
}

export interface GameState {
  playerCards: Card[];
  dealerCards: Card[];
  playerValue: number;
  dealerValue: number;
  gameStatus: string;
  isGameOver: boolean;
  deck_id: string;
}

export const getCardValue = (card: Card): number => {
  const faceCards = ["KING", "QUEEN", "JACK"];
  if (faceCards.includes(card.value)) return 10;
  if (card.value === "ACE") return 11;
  return parseInt(card.value);
};

export const calculateHandValue = async (deck_id: string, pile_name: string): Promise<number> => {
  const { piles } = await api.listPile(deck_id, pile_name);
  let total = 0;
  let aceCount = 0;

  for (const card of piles[pile_name].cards) {
    total += getCardValue(card);
    if (card.value === "ACE") aceCount++;
  }

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
};

export const dealInitialCards = async (
  deck_id: string,
  playerPile: string,
  dealerPile: string
): Promise<{ playerPile: string; dealerPile: string; playerCards: Card[]; dealerCards: Card[] }> => {
  const playerCards = (await api.drawCard(deck_id, 2)).cards;
  const dealerCards = (await api.drawCard(deck_id, 2)).cards;

  await api.addCardsToPile(
    deck_id,
    playerPile,
    playerCards.map((card: Card) => card.code)
  );
  await api.addCardsToPile(
    deck_id,
    dealerPile,
    dealerCards.map((card: Card) => card.code)
  );

  return { playerPile, dealerPile, playerCards, dealerCards };
};

export const checkBlackjack = async (deck_id: string, pile_name: string): Promise<boolean> =>
  (await calculateHandValue(deck_id, pile_name)) === 21;

// Modified playBlackJack to work with React state
export const playBlackJack = async (): Promise<GameState> => {
  const deck = await api.createDeck(false);
  const deck_id = deck.deck_id;
  await api.shuffleDeck(deck_id);

  const playerPile = "playerPile";
  const dealerPile = "dealerPile";

  const { playerCards, dealerCards } = await dealInitialCards(deck_id, playerPile, dealerPile);
  
  const playerValue = await calculateHandValue(deck_id, playerPile);
  const dealerValue = await calculateHandValue(deck_id, dealerPile);

  let gameStatus = "Player's turn";
  let isGameOver = false;

  // Check for blackjack
  if (await checkBlackjack(deck_id, playerPile) && await checkBlackjack(deck_id, dealerPile)) {
    gameStatus = "It's a tie! Both player and dealer have BlackJack.";
    isGameOver = true;
  } else if (await checkBlackjack(deck_id, playerPile)) {
    gameStatus = "Player wins with a BlackJack!";
    isGameOver = true;
  } else if (await checkBlackjack(deck_id, dealerPile)) {
    gameStatus = "Dealer wins with a BlackJack!";
    isGameOver = true;
  }

  return {
    playerCards,
    dealerCards,
    playerValue,
    dealerValue,
    gameStatus,
    isGameOver,
    deck_id,
  };
};

export const handlePlayerHit = async (gameState: GameState): Promise<GameState> => {
  const newCard = (await api.drawCard(gameState.deck_id)).cards[0];
  await api.addCardsToPile(gameState.deck_id, "playerPile", [newCard.code]);
  
  const newValue = await calculateHandValue(gameState.deck_id, "playerPile");
  const updatedPlayerCards = [...gameState.playerCards, newCard];

  if (newValue > 21) {
    return {
      ...gameState,
      playerCards: updatedPlayerCards,
      playerValue: newValue,
      gameStatus: "Player busts! Dealer wins.",
      isGameOver: true
    };
  }

  return {
    ...gameState,
    playerCards: updatedPlayerCards,
    playerValue: newValue
  };
};

export const handleDealerTurn = async (gameState: GameState): Promise<GameState> => {
  let currentDealerCards = [...gameState.dealerCards];
  let dealerValue = gameState.dealerValue;

  while (dealerValue < 17) {
    const newCard = (await api.drawCard(gameState.deck_id)).cards[0];
    await api.addCardsToPile(gameState.deck_id, "dealerPile", [newCard.code]);
    currentDealerCards.push(newCard);
    dealerValue = await calculateHandValue(gameState.deck_id, "dealerPile");
  }

  let gameStatus: string;
  if (dealerValue > 21) {
    gameStatus = "Dealer busts! Player wins.";
  } else if (dealerValue > gameState.playerValue) {
    gameStatus = "Dealer wins!";
  } else if (dealerValue < gameState.playerValue) {
    gameStatus = "Player wins!";
  } else {
    gameStatus = "It's a tie!";
  }

  return {
    ...gameState,
    dealerCards: currentDealerCards,
    dealerValue,
    gameStatus,
    isGameOver: true
  };
};