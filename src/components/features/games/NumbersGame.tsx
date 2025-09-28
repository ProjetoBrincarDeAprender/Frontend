import { Footer } from "@/components/Footer/Footer";
import { EventBus } from "@/games/common/utils/EventBus";
import CreditsScene from "@/games/numbers/scenes/CreditsScene";
import GameScene from "@/games/numbers/scenes/GameScene";
import StartScene from "@/games/numbers/scenes/StartScene";
import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";

export interface IRefNumbersGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

const NumbersGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [StartScene, GameScene, CreditsScene], // StartScene como primeira cena
      parent: "numbers-game-container",
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
          id="numbers-game-container"
          className="relative"
          style={{ width: 800, height: 600 }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default NumbersGame;
