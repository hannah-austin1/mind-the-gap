import React, { useEffect } from "react";
import { useGameEngine } from "@/app/providers/game-engine-provider";
import { Card } from "./card/card";

const GameBoard: React.FC = () => {
  const {
    timer,
    phase,
    players,
    currentPlayerId,
    discardPile,
    playCard,
    drawCard,
    isCurrentPlayer,
  } = useGameEngine();

  const currentPlayer = players.find((player) => player.id === currentPlayerId);
  console.log("XXX", currentPlayer);
  const playerCards = currentPlayer?.getState("cards");

  return (
    <div style={styles.boardContainer}>
      <h1>Mind the Gap</h1>

      <p>Current Player: {currentPlayer?.state?.profile?.name}</p>

      {isCurrentPlayer() ? (
        <div style={styles.currentPlayerMessage}>
          <h3>It&apos;s your turn!</h3>
        </div>
      ) : (
        <div style={styles.currentPlayerMessage}>
          <h3>Waiting for other players...</h3>
        </div>
      )}

      {/* Discard Pile in the center */}
      <div style={styles.gameArea}>
        <div style={styles.discardPile}>
          <h2>Discard Pile</h2>
          {discardPile.length > 0 && (
            <Card
              card={discardPile[discardPile.length - 1]}
              onClick={() => {}} // No action on the discard pile
            />
          )}
        </div>

        {/* Player's hand of cards */}
        <div style={styles.handContainer}>
          <h2>Your Cards</h2>
          <div style={styles.hand}>
            {playerCards &&
              playerCards.map((card: any, index: number) => (
                <Card
                  key={index}
                  card={card}
                  onClick={() => {
                    if (isCurrentPlayer()) playCard(index);
                  }}
                />
              ))}
          </div>
          <button
            style={styles.drawButton}
            onClick={() => {
              if (isCurrentPlayer()) drawCard();
            }}
          >
            Draw Card
          </button>
        </div>
      </div>
    </div>
  );
};

// Basic styles for layout
const styles = {
  boardContainer: {
    textAlign: "center" as "center",
    padding: "20px",
  },
  gameArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column" as "column",
    position: "relative" as "relative",
  },
  discardPile: {
    marginBottom: "20px",
  },
  handContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  hand: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap" as "wrap",
  },
  drawButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  currentPlayerMessage: {
    marginBottom: "20px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default GameBoard;
