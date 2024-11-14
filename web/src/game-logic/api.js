const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: "https://deckofcardsapi.com/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a Deck
const createDeck = async (jokers_enabled = true) => {
  const response = await axiosInstance.get(
    `/new?jokers_enabled=${jokers_enabled}`
  );

  return response.data;
};

// Draw a Card
const drawCard = async (deck_id, count = 1) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/draw/?count=${count}`
  );

  return response.data;
};

// Shuffle the Deck
const shuffleDeck = async (deck_id, remaining = false) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/shuffle/?remaining=${remaining}`
  );

  return response.data;
};

// Return cards to the deck
const returnCards = async (deck_id, cards) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/return/?cards=${cards.join(",")}`
  );
  return response.data;
};

// Create a partial deck of cards
const createPartialDeck = async (cardCodes) => {
  const response = await axiosInstance.get(
    `/deck/new/?cards=${cardCodes.join(",")}`
  );
  return response.data;
};

// Add cards to a pile
const addCardsToPile = async (deck_id, pile_name, cards) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/add/?cards=${cards.join(",")}`
  );
  return response.data;
};

// Shuffle a pile
const shufflePile = async (deck_id, pile_name) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/shuffle/`
  );
  return response.data;
};

// List cards in a pile
const listPile = async (deck_id, pile_name) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/list/`
  );
  return response.data;
};

// Draw specified cards from a pile
const drawCardsFromPile = async (deck_id, pile_name, cards) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/?cards=${cards.join(",")}`
  );
  return response.data;
};

// Draw a number of cards from the pile
const drawCountFromPile = async (deck_id, pile_name, count = 1) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/?count=${count}`
  );
  return response.data;
};

// Draw a card from the bottom of a pile (if supported)
const drawBottomFromPile = async (deck_id, pile_name, count = 1) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/bottom/?count=${count}`
  );
  return response.data;
};

// Draw a random card from a pile
const drawRandomFromPile = async (deck_id, pile_name, count = 1) => {
  const response = await axiosInstance.get(
    `/deck/${deck_id}/pile/${pile_name}/draw/random/?count=${count}`
  );
  return response.data;
};

// Export the functions (NOTE: this is a little different than ESM (ES Modules), this is CommonJS)
module.exports = {
  createDeck,
  drawCard,
  shuffleDeck,
  returnCards,
  createPartialDeck,
  addCardsToPile,
  shufflePile,
  listPile,
  drawCardsFromPile,
  drawCountFromPile,
  drawBottomFromPile,
  drawRandomFromPile,
};
