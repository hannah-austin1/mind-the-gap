import { getState, setState } from "playroomkit";
import { Player } from "../providers/game-engine-provider";

// Define wildcard structure
export interface Wildcard {
  text: string;
  description: string;
  effect: (players: Player[], currentPlayerIndex: number) => void;
}

// Wildcards definition
export const wildcards: Wildcard[] = [
  {
    text: "The next station is CLOSED",
    description: "Skip the next player's turn.",
    effect: (players, currentPlayerIndex) => {
      // Skip the next player's turn by moving to the player after
      const nextPlayerIndex = (currentPlayerIndex + 2) % players.length;
      getState("playerTurn").set(nextPlayerIndex, true);
    },
  },
  {
    text: "ALL CHANGE",
    description: "All players must swap their hands with the next player.",
    effect: (players, currentPlayerIndex) => {
      // Swap cards between players
      const playerCards = players.map((player) => player.getState("cards"));
      for (let i = 0; i < players.length; i++) {
        const nextPlayer = (i + 1) % players.length;
        players[i].setState("cards", playerCards[nextPlayer], true);
      }
    },
  },
  {
    text: "STEP FREE ACCESS",
    description: "Draw one extra card.",
    effect: (players, currentPlayerIndex) => {
      const currentPlayer = players[currentPlayerIndex];
      const deck = getState("deck");
      const newCard = deck[0];
      const remainingDeck = deck.slice(1);
      const currentCards = currentPlayer.getState("cards");
      currentPlayer.setState("cards", [...currentCards, newCard], true);
      setState("deck", remainingDeck, true);
    },
  },
];
