import React, { useEffect } from "react";
import {
  getState,
  isHost,
  onPlayerJoin,
  useMultiplayerState,
  usePlayersList,
  myPlayer,
} from "playroomkit";
import stations from "@/app/lib/stations.json";
import { Wildcard, wildcards } from "../lib/wildcards";

// Types for station cards and players
export interface StationCard {
  station: string;
  lines: { color: string; name: string }[];
}

export interface PlayerProfile {
  name?: string;
}

export interface Player {
  id: string;
  state: { profile: PlayerProfile };
  getState: (key: string) => any;
  setState: (key: string, value: any, sync?: boolean) => void;
}

interface GameState {
  timer: number;
  round: number;
  phase: string;
  currentPlayerId: string;
  players: Player[];
  deck: (StationCard[] | Wildcard)[];
  discardPile: (StationCard[] | Wildcard)[];
  actionSuccess: boolean;
}

interface LineColor {
  line_name: string;
  color: string;
}

type LineColors = {
  [key in keyof typeof stations.line_colors]: LineColor;
};

interface GameEngineContextType extends GameState {
  startGame: () => void;
  playCard: (cardIndex: number) => void;
  drawCard: () => void;
  isCurrentPlayer: () => boolean;
}

const GameEngineContext = React.createContext<
  GameEngineContextType | undefined
>(undefined);

const TIME_PHASE_CARDS = 10;
const CARDS_PER_PLAYER = 7;

// Helper to generate a deck of station cards
const generateStationDeck = (): (StationCard[] | Wildcard)[] => {
  console.log("HERE: Generating station deck");
  const stationDeck: StationCard[] = stations.stations.map((station) => {
    const lines = station.lines.map((lineId) => {
      const line = stations.line_colors[lineId as unknown as keyof LineColors];
      return { name: line.line_name, color: line.color };
    });
    return { station: station.station_name, lines };
  });

  // Add wildcards to the deck
  const fullDeck = [...stationDeck, ...wildcards];

  // Shuffle the full deck
  return shuffle(fullDeck);
};

// Shuffle deck
const shuffle = (
  deck: (StationCard[] | Wildcard)[]
): (StationCard[] | Wildcard)[] => {
  return deck.sort(() => Math.random() - 0.5);
};

// GameEngineProvider component
export const GameEngineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const players = usePlayersList(true) as Player[];
  players.sort((a, b) => a.id.localeCompare(b.id)); // Sort players by their ID

  const [currentPlayerId, setCurrentPlayerId] = useMultiplayerState(
    "currentPlayerId",
    players[0]?.id
  );

  const [deck, setDeck] = useMultiplayerState("deck", []);
  const [discardPile, setDiscardPile] = useMultiplayerState("discardPile", []);
  const [timer, setTimer] = useMultiplayerState("timer", 0);
  const [round, setRound] = useMultiplayerState("round", 1);
  const [phase, setPhase] = useMultiplayerState("phase", "lobby");

  const [localPlayerId] = useMultiplayerState("playerId", myPlayer().id); // Track local player

  players.forEach((player) => {
    console.log("cards", player.getState("cards"));
  });

  // Function to determine if the local player is the current player
  const isCurrentPlayer = (): boolean => {
    return currentPlayerId === localPlayerId;
  };

  // Function to get the next player by rotating through the list
  const getNextPlayer = () => {
    const currentPlayerIndex = players.findIndex(
      (player) => player.id === currentPlayerId
    );
    const nextPlayer = players[(currentPlayerIndex + 1) % players.length];
    return nextPlayer;
  };

  // Move to the next player
  const moveToNextPlayer = () => {
    const nextPlayer = getNextPlayer();
    setCurrentPlayerId(nextPlayer.id, true); // Set the next player by ID and sync
  };

  // Start the game
  const startGame = () => {
    if (isHost()) {
      console.log("START GAME: Host is initializing the game");
      setTimer(TIME_PHASE_CARDS, true);
      setRound(1, true);
      const stationDeck = generateStationDeck();
      setDeck(stationDeck, true);
      console.log("Generated deck:", stationDeck); // Log to check if deck is generated
      players.forEach((player) => {
        player.setState("cards", [], true);
      });
      distributeCards(CARDS_PER_PLAYER, stationDeck);
      const initialDiscard = stationDeck.pop()!;
      setDiscardPile([initialDiscard], true);
      setPhase("play", true);
    }
  };

  // Distribute cards to players
  const distributeCards = (nbCards: number, thisDeck: any) => {
    const newDeck = [...thisDeck];
    console.log("D", thisDeck);
    players.forEach((player) => {
      const cards = player.getState("cards") || [];
      for (let i = 0; i < nbCards; i++) {
        const randomIndex = Math.floor(Math.random() * newDeck.length);
        cards.push(newDeck[randomIndex]);
        newDeck.splice(randomIndex, 1);
      }
      console.log("CARDS0", cards);
      player.setState("cards", cards, true);
      console.log("CARDS", player.getState("cards"));
      player.setState("selectedCard", 0, true);
    });
    setDeck(newDeck, true);
  };

  useEffect(() => {
    if (isHost()) {
      startGame(); // Start game only if the player is host
    }
    onPlayerJoin(() => {
      console.log("Player joined, restarting game");
      startGame(); // Ensure the game starts when new players join
    });
  }, [phase]); // Listen to phase and ensure it restarts correctly

  return (
    <GameEngineContext.Provider
      value={{
        timer,
        round,
        phase,
        currentPlayerId,
        players,
        deck,
        discardPile,
        actionSuccess: true,
        startGame,
        playCard: () => {}, // Placeholder
        drawCard: () => {}, // Placeholder
        isCurrentPlayer,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
};

// Hook to access the game engine context
export const useGameEngine = (): GameEngineContextType => {
  const context = React.useContext(GameEngineContext);
  if (context === undefined) {
    throw new Error("useGameEngine must be used within a GameEngineProvider");
  }
  return context;
};
