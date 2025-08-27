import React, { useEffect } from "react";
import Phaser from "phaser";
import Vowels from "@/games/vowels/Vowels";

const VowelsGame: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [Vowels],
      parent: "game-container",
      backgroundColor: "#ffffff",
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="flex justify-center"></div>;
};

export default VowelsGame;
