import React, { useEffect } from "react";
import Phaser from "phaser";
import Vowels from "@/games/vowels/Vowels";
import { Footer } from "@/components/footer/Footer";
import { EventBus } from "@/games/EventBus";

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

    EventBus.on("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <>
      {/* <Header /> */}
      <div id="game-container" className="mt-5 mb-20 flex justify-center"></div>
      <Footer />
    </>
  );
};

export default VowelsGame;
