import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

const PunctuationGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const startScene = new StartScene({
      nextSceneName: "clickButtonGameScene",
      backgroundPath: "/assets/punctuationGame/images/backgroundMain.png",
      // backgroundKey: "startBg",
      gameTitle: "PONTUANDO FRASES",
    });

    const gameScene = new ClickButtonGameScene();
    // "/assets/vowelsGame/gameData/mainData.JSON",

    const levelCompleted = new LevelCompletedScene({
      // nextLevelScene: "clickButtonGameScene",
      // menuScene: "StartScene",
      // backgroundPath: "/assets/vowelsGame/images/backgroundMain.png",
      // backgroundKey: "levelCompletedBg",
      // onMenuReturn: () => {
      //   ClickButtonGameScene.resetRegistry(gameScene);
      // },
    });

    const endScene = new EndScene({
      // restartScene: "clickButtonGameScene",
      // backgroundPath: "/assets/vowelsGame/images/backgroundMain.png",
      // backgroundKey: "endBg",
    });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [startScene, levelCompleted, gameScene, endScene],
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

    // return () => {
    //   gameRef.current?.destroy(true);
    //   gameRef.current = null;
    // };
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

export default PunctuationGame;
