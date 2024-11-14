import {
  createDeck,
  drawCard,
  shuffleDeck,
  addCardsToPile,
  listPile,
  Card,
} from "./api";

const getCardValue = (card: Card) => {
  const faceCards = ["KING", "QUEEN", "JACK"];
  if (faceCards.includes(card.value)) return 10;
  if (card.value === "ACE") return 11;
  return parseInt(card.value);
};

const calculateHandValue = async (deck_id: string, pile_name: string) => {
  const { piles } = await listPile(deck_id, pile_name);
  let total = 0;
  let aceCount = 0;

  for (const card of piles[pile_name].cards) {
    total += getCardValue(card);
    if (card.value === "ACE") aceCount++;
  }

  // Adjust ACE value from 11 to 1 if total goes over 21
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
};

const dealInitialCards = async (
  deck_id: string,
  playerPile: string,
  dealerPile: string
) => {
  const playerCards = (await drawCard(deck_id, 2)).cards;
  const dealerCards = (await drawCard(deck_id, 2)).cards;

  await addCardsToPile(
    deck_id,
    playerPile,
    playerCards.map((card: Card) => card.code)
  );
  await addCardsToPile(
    deck_id,
    dealerPile,
    dealerCards.map((card: Card) => card.code)
  );

  console.log(
    `Player's initial hand: ${playerCards
      .map((card: Card) => card.code)
      .join(", ")}`
  );
  console.log(
    `Dealer's initial hand: ${dealerCards
      .map((card: Card) => card.code)
      .join(", ")}`
  );

  return { playerPile, dealerPile };
};

const checkBlackjack = async (deck_id: string, pile_name: string) =>
  (await calculateHandValue(deck_id, pile_name)) === 21;

// BlackJack game logic
const playBlackJack = async () => {
  const deck = await createDeck(false);
  const deck_id = deck.deck_id;
  await shuffleDeck(deck_id);

  const playerPile = "playerPile";
  const dealerPile = "dealerPile";

  const { playerPile: playerHand, dealerPile: dealerHand } =
    await dealInitialCards(deck_id, playerPile, dealerPile);

  // Check for win at start of game
  if (
    (await checkBlackjack(deck_id, playerHand)) &&
    (await checkBlackjack(deck_id, dealerHand))
  ) {
    return "It's a tie! Both player and dealer have BlackJack.";
  } else if (await checkBlackjack(deck_id, playerHand)) {
    return "Player wins with a BlackJack!";
  } else if (await checkBlackjack(deck_id, dealerHand)) {
    return "Dealer wins with a BlackJack!";
  }

  // Player's Turn
  let playerValue = await calculateHandValue(deck_id, playerHand);
  let playerTurnOver = false;

  while (!playerTurnOver) {
    console.log(`Player's current hand value: ${playerValue}`);
    if (playerValue < 17) {
      const newCard = (await drawCard(deck_id)).cards[0];
      await addCardsToPile(deck_id, playerHand, [newCard.code]);
      playerValue = await calculateHandValue(deck_id, playerHand);
      console.log(
        `Player draws ${newCard.code}. New hand value: ${playerValue}`
      );
      if (playerValue > 21) return "Player busts! Dealer wins.";
    } else {
      playerTurnOver = true;
    }
  }

  // Dealer's Turn
  let dealerValue = await calculateHandValue(deck_id, dealerHand);
  while (dealerValue < 17) {
    const newCard = (await drawCard(deck_id)).cards[0];
    await addCardsToPile(deck_id, dealerHand, [newCard.code]);
    dealerValue = await calculateHandValue(deck_id, dealerHand);
    console.log(`Dealer draws ${newCard.code}. New hand value: ${dealerValue}`);
    if (dealerValue > 21) return "Dealer busts! Player wins.";
  }

  // Compare hands for winner
  console.log(`Player's final hand value: ${playerValue}`);
  console.log(`Dealer's final hand value: ${dealerValue}`);

  if (playerValue > dealerValue) {
    return "Player wins!";
  } else if (playerValue < dealerValue) {
    return "Dealer wins!";
  } else {
    return "It's a tie!";
  }
};

// Play the game
playBlackJack().then(console.log).catch(console.error);
