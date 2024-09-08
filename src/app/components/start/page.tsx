"use client";

import { useIsHost, useMultiplayerState } from "playroomkit";
import { useEffect } from "react";

const StartPage = () => {
  const isHost = useIsHost();

  const [, setGameState] = useMultiplayerState("gameState", "start");

  const handleStartGame = () => {
    setGameState("game/new");
  };

  useEffect(() => {
    handleStartGame();
  }, []);

  return <>{isHost ? <>Loading...</> : <>Waiting for host...</>}</>;
};

export default StartPage;
