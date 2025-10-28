import { Footer } from "@/components/Footer/Footer";
import { EventBus } from "@/games/common/utils/EventBus";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import Phaser from "phaser";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";

const SyllableGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const startScene = new StartScene({
      nextSceneName: "clickButtonGameScene",
      backgroundPath: "/assets/syllableGame/images/backgroundMain.png",
      backgroundKey: "startBg",
      gameTitle: "SÍLABAS",
      // trophyImagePath: "/assets/common/duda/dudaClap.png",
      // trophyImageKey: "dudaClap",
    });

    const gameScene = new ClickButtonGameScene(
      "/assets/syllableGame/gameData/mainData.JSON",
    );

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [startScene, gameScene],
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

export default SyllableGame;
