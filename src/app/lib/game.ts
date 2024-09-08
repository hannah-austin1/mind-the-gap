interface UnoCard {
  color: string | null;
  value: string | number;
}

interface Player {
  id: string;
  hand: UnoCard[];
}

interface GameState {
  players: Player[];
  deck: UnoCard[];
  discardPile: UnoCard[];
  currentPlayerIndex: number;
  playDirection: number; // 1 for clockwise, -1 for counterclockwise
}

// Initial game state
const initialState: GameState = {
  players: [],
  deck: [],
  discardPile: [],
  currentPlayerIndex: 0,
  playDirection: 1,
};

// Generate the Uno deck
function generateDeck(): UnoCard[] {
  const colors = ["red", "yellow", "green", "blue"];
  const values = [...Array(10).keys(), "reverse", "skip", "draw2"];
  const deck: UnoCard[] = [];

  colors.forEach((color) => {
    values.forEach((value) => {
      deck.push({ color, value });
      if (value !== 0) deck.push({ color, value }); // Two copies of each non-zero card
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ color: null, value: "wild" });
    deck.push({ color: null, value: "wilddraw4" });
  }

  return shuffle(deck);
}

// Shuffle the deck
function shuffle(deck: UnoCard[]): UnoCard[] {
  return deck.sort(() => Math.random() - 0.5);
}

// Draw cards from the deck
function drawCards(deck: UnoCard[], count: number): [UnoCard[], UnoCard[]] {
  return [deck.slice(0, count), deck.slice(count)];
}

// Get the current card on top of the discard pile
function getCurrentCard(gameState: GameState): UnoCard {
  return gameState.discardPile[gameState.discardPile.length - 1];
}

// Check if a card can be played on top of the current discard pile card
function cardMatches(card: UnoCard, topCard: UnoCard): boolean {
  return (
    card.color === topCard.color ||
    card.value === topCard.value ||
    card.color === null
  );
}

// Handle special cards like reverse, skip, draw2, etc.
function handleSpecialCard(card: UnoCard, gameState: GameState): GameState {
  if (card.value === "reverse") {
    gameState.playDirection *= -1;
  } else if (card.value === "skip") {
    gameState = nextPlayer(gameState);
  } else if (card.value === "draw2") {
    gameState = nextPlayer(gameState);
    gameState.players[gameState.currentPlayerIndex].hand.push(
      ...drawCards(gameState.deck, 2)[0]
    );
  } else if (card.value === "wilddraw4") {
    gameState = nextPlayer(gameState);
    gameState.players[gameState.currentPlayerIndex].hand.push(
      ...drawCards(gameState.deck, 4)[0]
    );
  }
  return gameState;
}

// Move to the next player
function nextPlayer(gameState: GameState): GameState {
  const numPlayers = gameState.players.length;
  gameState.currentPlayerIndex =
    (gameState.currentPlayerIndex + gameState.playDirection + numPlayers) %
    numPlayers;
  return gameState;
}

// Start the game by shuffling the deck and dealing cards to players
function startGame(players: Player[]): GameState {
  let deck = generateDeck();
  const discardPile = [deck.pop()!];
  const gameState: GameState = {
    players,
    deck,
    discardPile,
    currentPlayerIndex: 0,
    playDirection: 1,
  };

  // Deal 7 cards to each player
  gameState.players = gameState.players.map((player) => {
    const [hand, remainingDeck] = drawCards(gameState.deck, 7);
    gameState.deck = remainingDeck;
    return { ...player, hand };
  });

  return gameState;
}

// Play a card from a player's hand
function playCard(
  gameState: GameState,
  playerId: string,
  cardIndex: number
): GameState {
  const player = gameState.players.find((p) => p.id === playerId);

  if (!player) return gameState;

  const card = player.hand[cardIndex];
  const topCard = getCurrentCard(gameState);

  if (cardMatches(card, topCard)) {
    player.hand.splice(cardIndex, 1);
    gameState.discardPile.push(card);

    if (player.hand.length === 0) {
      // Player wins
      console.log(`${playerId} wins the game!`);
      return gameState;
    }

    gameState = handleSpecialCard(card, gameState);
    gameState = nextPlayer(gameState);
  } else {
    console.log("Invalid card played!");
  }

  return gameState;
}

// Draw a card
function drawCard(gameState: GameState, playerId: string): GameState {
  const player = gameState.players.find((p) => p.id === playerId);

  if (!player) return gameState;

  const [newCard, newDeck] = drawCards(gameState.deck, 1);
  player.hand.push(...newCard);
  gameState.deck = newDeck;

  return nextPlayer(gameState);
}

export { startGame, playCard, drawCard };
