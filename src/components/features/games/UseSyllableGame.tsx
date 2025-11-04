import { Footer } from "@/components/Footer/Footer";
import { EventBus } from "@/games/common/utils/EventBus";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";

const UseSyllableGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const startScene = new StartScene({
      nextSceneName: "clickButtonGameScene",
      backgroundPath: "/assets/useSyllableGame/images/backgroundStart.png",
      backgroundKey: "startBg",
      gameTitle: "USANDO SÍLABAS",
    });

    const gameScene = new ClickButtonGameScene(
      "/assets/useSyllableGame/gameData/mainData.JSON",
    );

    const levelComplete = new LevelCompletedScene({
      nextLevelScene: "clickButtonGameScene",
      backgroundPath: "/assets/useSyllableGame/images/backgroundMain.png",
      backgroundKey: "levelBg",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });

    const endScene = new EndScene({
      restartScene: "clickButtonGameScene",
      backgroundPath: "/assets/useSyllableGame/images/backgroundMain.png",
      backgroundKey: "endBg",
    });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [startScene, levelComplete, gameScene, endScene],
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

export default UseSyllableGame;
