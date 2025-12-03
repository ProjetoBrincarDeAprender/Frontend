import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EventBus } from "@/games/common/utils/EventBus";
import { useEffect, useRef } from "react";
import { useUser } from "@/hooks/User/useUser";
import { StartScene } from "@/games/common/scenes/StartScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import SyllableDivision from "@/games/syllableDivision/SyllableDivision";
import Phaser from "phaser";

const SyllableDivisionGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const startScene = new StartScene({
      nextSceneName: "SyllableDivision",
      gameTitle: "DIVIDINDO SÍLABAS",
    });

    const gameScene = new SyllableDivision({
      backgroundPath: "/assets/syllableDivisionGame/images/backgroundMain.png",
      instruction: "SEPARE A PALAVRA",
      levels: [
        ["CA", "SA"],
        ["BO", "LA"],
        ["SO", "FÁ"],
        ["PA", "TO"],
        ["MA", "LA"],
      ],
    });

    const levelCompleted = new LevelCompletedScene({
      nextLevelScene: "SyllableDivision",

      menuScene: "StartScene",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });

    const endScene = new EndScene({
      restartScene: "StartScene",
    });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [gameScene, startScene, levelCompleted, endScene],
      parent: containerRef.current,
      backgroundColor: "#ffffff",
    };

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });
  }, [user]);

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

export default SyllableDivisionGame;
