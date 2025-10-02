import { Footer } from "@/components/Footer/Footer";
import { EventBus } from "@/games/common/utils/EventBus";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import Phaser from "phaser";
import VowelsStartScene from "@/games/vowels/scenes/VowelsStartScene";
import VowelsGameScene from "@/games/vowels/scenes/VowelsGameScene";
import VowelsCreditsScene from "@/games/vowels/scenes/VowelsCreditsScene";

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
      scene: [VowelsStartScene, VowelsGameScene, VowelsCreditsScene],
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
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <BackButton />
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
