import { useEffect, useRef } from "react";
import { Footer } from "@/components/footer/Footer";
import { EventBus } from "@/games/EventBus";
import Phaser from "phaser";
import Vowels from "@/games/vowels/Vowels";

export interface IRefVowelsGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

const VowelsGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [Vowels],
      parent: "game-container",
      backgroundColor: "#ffffff",
    };

    gameRef.current = new Phaser.Game(config);

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <>
      <div className="mt-5 mb-20 flex justify-center">
        {/* <Header /> */}
        <div
          id="game-container"
          className="relative"
          style={{ width: 800, height: 600 }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default VowelsGame;
