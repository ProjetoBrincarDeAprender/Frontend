import { Footer } from "@/components/Footer/Footer";
import { EventBus } from "@/games/common/utils/EventBus";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import Phaser from "phaser";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";

const NumbersGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const startScene = StartScene.create(
      "clickButtonGameScene",
      "/assets/numbersGame/background.png",
      "NÚMEROS",
      "SEQUENCIA NUMÉRICA",
    );
    const gameScene = new ClickButtonGameScene(
      "/assets/numbersGame/gameData/mainData.JSON",
    );
    const levelCompleted = new LevelCompletedScene({
      nextLevelScene: "clickButtonGameScene",
      menuScene: "StartScene",
      backgroundPath: "/assets/numbersGame/background.png",
      backgroundKey: "levelCompletedBg",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });
    const endScene = EndScene.create(
      "clickButtonGameScene",
      undefined,
      undefined,
      "VOCÊ COMPLETOU\nTODAS AS SEQUÊNCIAS!",
    );

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [startScene, levelCompleted, gameScene, endScene],
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

export default NumbersGame;
