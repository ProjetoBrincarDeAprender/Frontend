import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import { EndScene } from "@/games/common/scenes/EndScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import ConsonantSelectionScene from "@/games/common/content/ConsonantSelectionScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

const SimpleSyllableGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!containerRef.current) return;

    const startScene = new StartScene({
      nextSceneName: "ConsonantSelectionScene",
      backgroundPath: "/assets/simpleSyllableGame/images/backgroundStart.png",
      backgroundKey: "startBg",
      gameTitle: "CRIANDO SÍLABAS",
    });

    const consonantSelectionScene = new ConsonantSelectionScene({
      backgroundPath: "/assets/simpleSyllableGame/images/backgroundMain.png",
      backgroundKey: "consonantSelectionBg",
      nextSceneName: "clickButtonGameScene",
      title: "ESCOLHA UMA CONSOANTE",
    });

    const gameScene = new ClickButtonGameScene();

    const endScene = new EndScene({
      backgroundPath: "/assets/simpleSyllableGame/images/backgroundMain.png",
      backgroundKey: "endBg",
    });

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [startScene, consonantSelectionScene, gameScene, endScene],
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

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
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

export default SimpleSyllableGame;
