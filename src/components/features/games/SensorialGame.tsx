import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { SensorialGameScene } from "@/games/sensorial/scenes/SensorialGameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefSensorialGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface SensorialGameProps {
  activityId?: number;
}

export const SensorialGame = ({ activityId = 6 }: SensorialGameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [
        StartScene.create(
          "SensorialGameScene",
          "/assets/sensorialGame/background.png",
          "background",
          "JOGO SENSORIAL",
          "/assets/sensorialGame/mascot.png",
          "mascot",
        ),
        SensorialGameScene,
        LevelCompletedScene.create(
          "SensorialGameScene",
          "StartScene",
          "/assets/sensorialGame/background.png",
          "background",
          "/assets/sensorialGame/mascot.png",
          "mascot",
          "SONS DESCOBERTOS!",
        ),
        EndScene.create(
          "StartScene",
          "/assets/sensorialGame/background.png",
          "background",
          "PARABÉNS!\nVOCÊ EXPLOROU TODOS OS SONS!",
          "/assets/common/trophy.png",
          "trophy",
        ),
      ],
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [user, activityId]);

  return (
    <>
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          id="game-container"
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        ></div>
      </div>
      <Footer />
    </>
  );
};
