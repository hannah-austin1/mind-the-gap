// app/uno/page.tsx

import React from "react";
import { GameEngineProvider } from "@/app/providers/game-engine-provider";
import GameBoard from "@/app/components/game-board";

const UnoPage: React.FC = () => {
  return (
    <GameEngineProvider>
      <GameBoard />
    </GameEngineProvider>
  );
};

export default UnoPage;
