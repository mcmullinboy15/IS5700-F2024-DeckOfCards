import { useState } from "react";
import { createDeck, drawCard, shuffleDeck, Card } from "./api";

// Type definitions for state and functions
interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  playerScore: number;
  dealerScore: number;
  gameEvents: string[];
  gameStatus:
    | "waiting"
    | "inProgress"
    | "playerTurn"
    | "dealerTurn"
    | "completed";
}

interface UseBlackjackReturn {
  state: GameState;
  startGame: () => Promise<void>;
  playPlayerTurn: () => Promise<void>;
  playDealerTurn: () => Promise<void>;
  resetGame: () => void;
  getGameEvents: () => string[];
}

const getCardValue = (card: Card) => {
  const faceCards = ["KING", "QUEEN", "JACK"];
  if (faceCards.includes(card.value)) return 10;
  if (card.value === "ACE") return 11;
  return parseInt(card.value);
};

const calculateHandValue = (hand: Card[]) => {
  let total = 0;
  let aceCount = 0;

  hand.forEach((card) => {
    total += getCardValue(card);
    if (card.value === "ACE") aceCount++;
  });

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
};

export const useBlackjack = (): UseBlackjackReturn => {
  const [state, setState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    playerScore: 0,
    dealerScore: 0,
    gameEvents: [],
    gameStatus: "waiting",
  });

  const startGame = async () => {
    const deck = await createDeck(false);
    await shuffleDeck(deck.deck_id);

    const playerCards = (await drawCard(deck.deck_id, 2)).cards;
    const dealerCards = (await drawCard(deck.deck_id, 2)).cards;

    setState({
      playerHand: playerCards,
      dealerHand: dealerCards,
      playerScore: calculateHandValue(playerCards),
      dealerScore: calculateHandValue(dealerCards),
      gameEvents: [
        "Game started.",
        `Player dealt: ${playerCards
          .map((card: { code: any }) => card.code)
          .join(", ")}`,
        `Dealer dealt: ${dealerCards
          .map((card: { code: any }) => card.code)
          .join(", ")}`,
      ],
      gameStatus: "playerTurn",
    });
  };

  const playPlayerTurn = async () => {
    if (state.gameStatus !== "playerTurn") return;

    const newCard = (await drawCard(state.playerHand[0].deck_id)).cards[0];
    const updatedHand = [...state.playerHand, newCard];
    const newScore = calculateHandValue(updatedHand);

    setState((prevState) => ({
      ...prevState,
      playerHand: updatedHand,
      playerScore: newScore,
      gameEvents: [
        ...prevState.gameEvents,
        `Player draws: ${newCard.code}. New score: ${newScore}`,
      ],
    }));

    if (newScore > 21) {
      setState((prevState) => ({
        ...prevState,
        gameEvents: [...prevState.gameEvents, "Player busts! Dealer wins."],
        gameStatus: "completed",
      }));
    }
  };

  const playDealerTurn = async () => {
    if (state.gameStatus !== "dealerTurn") return;

    let dealerHand = [...state.dealerHand];
    let dealerScore = state.dealerScore;

    while (dealerScore < 17) {
      const newCard = (await drawCard(state.dealerHand[0].deck_id)).cards[0];
      dealerHand.push(newCard);
      dealerScore = calculateHandValue(dealerHand);

      setState((prevState) => ({
        ...prevState,
        dealerHand,
        dealerScore,
        gameEvents: [
          ...prevState.gameEvents,
          `Dealer draws: ${newCard.code}. New score: ${dealerScore}`,
        ],
      }));

      if (dealerScore > 21) {
        setState((prevState) => ({
          ...prevState,
          gameEvents: [...prevState.gameEvents, "Dealer busts! Player wins."],
          gameStatus: "completed",
        }));
        return;
      }
    }

    // Determine winner
    const { playerScore } = state;
    let outcome = "It's a tie!";
    if (playerScore > dealerScore) outcome = "Player wins!";
    else if (playerScore < dealerScore) outcome = "Dealer wins!";

    setState((prevState) => ({
      ...prevState,
      gameEvents: [...prevState.gameEvents, outcome],
      gameStatus: "completed",
    }));
  };

  const resetGame = () => {
    setState({
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0,
      gameEvents: [],
      gameStatus: "waiting",
    });
  };

  const getGameEvents = () => state.gameEvents;

  return {
    state,
    startGame,
    playPlayerTurn,
    playDealerTurn,
    resetGame,
    getGameEvents,
  };
};
