import { Footer } from "@/components/Footer/Footer";
import { EventBus } from "@/games/common/utils/EventBus";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import Phaser from "phaser";
import ClickButtonStartScene from "@/games/clickedButton/scenes/ClickButtonStart";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";

export interface IRefClickButtonGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

const ClickButtonGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const clickButtonStartScene = new ClickButtonStartScene(
      "/assets/clickButtonGame/gameData/startData.JSON",
    );
    const clickButtonGameScene = new ClickButtonGameScene(
      "/assets/clickButtonGame/gameData/mainData.JSON",
    );

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [clickButtonStartScene, clickButtonGameScene],
      parent: containerRef.current,
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
          ref={containerRef}
          className="relative"
          style={{ width: 800, height: 600 }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default ClickButtonGame;
