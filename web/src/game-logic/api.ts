import axios from "axios";

export type Deck = {
  success: boolean;
  deck_id: string;
  remaining: number;
  shuffled: boolean;
};

export type Card = {
  image: string;
  value: string;
  suit: string;
  code: string;
};

const axiosInstance = axios.create({
  baseURL: "https://deckofcardsapi.com/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a Deck
export const createDeck = async (jokers_enabled = true) => {
  const response = await axiosInstance.get(
    `/new?jokers_enabled=${jokers_enabled}`
  );

  return response.data;
};

// Draw a Card
export const drawCard = async (deck_id: string, count = 1) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/draw/?count=${count}`
  );

  return response.data;
};

// Shuffle the Deck
export const shuffleDeck = async (deck_id: string, remaining = false) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/shuffle/?remaining=${remaining}`
  );

  return response.data;
};

// Return cards to the deck
export const returnCards = async (deck_id: string, cards: string[]) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/return/?cards=${cards.join(",")}`
  );
  return response.data;
};

// Create a partial deck of cards
export const createPartialDeck = async (cardCodes: string[]) => {
  const response = await axiosInstance.get(
    `/deck/new/?cards=${cardCodes.join(",")}`
  );
  return response.data;
};

// Add cards to a pile
export const addCardsToPile = async (
  deck_id: string,
  pile_name: string,
  cards: string[]
) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/add/?cards=${cards.join(",")}`
  );
  return response.data;
};

// Shuffle a pile
export const shufflePile = async (deck_id: string, pile_name: string) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/shuffle/`
  );
  return response.data;
};

// List cards in a pile
export const listPile = async (deck_id: string, pile_name: string) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/list/`
  );
  return response.data;
};

// Draw specified cards from a pile
export const drawCardsFromPile = async (
  deck_id: string,
  pile_name: string,
  cards: string[]
) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/?cards=${cards.join(",")}`
  );
  return response.data;
};

// Draw a number of cards from the pile
export const drawCountFromPile = async (
  deck_id: string,
  pile_name: string,
  count = 1
) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/?count=${count}`
  );
  return response.data;
};

// Draw a card from the bottom of a pile (if supported)
export const drawBottomFromPile = async (
  deck_id: string,
  pile_name: string,
  count = 1
) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/bottom/?count=${count}`
  );
  return response.data;
};

// Draw a random card from a pile
export const drawRandomFromPile = async (
  deck_id: string,
  pile_name: string,
  count = 1
) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/random/?count=${count}`
  );
  return response.data;
};
