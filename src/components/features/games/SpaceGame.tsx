import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { SpaceGameScene } from "@/games/space/scenes/SpaceLevelScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefSpaceGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface SpaceGameProps {
  activityId?: number;
}

export const SpaceGame = ({ activityId = 3 }: SpaceGameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [
        StartScene.create(
          "SpaceGameScene",
          "/assets/spaceGame/background.png",
          "background",
          "VAMOS JOGAR",
          "/assets/common/trophy.png",
          "trophy",
        ),
        SpaceGameScene,
        LevelCompletedScene.create(
          "SpaceGameScene",
          "StartScene",
          "/assets/spaceGame/background.png",
          "background",
          "/assets/common/trophy.png",
          "trophy",
          "PLANETA EXPLORADO!",
        ),
        EndScene.create(
          "StartScene",
          "/assets/spaceGame/background.png",
          "background",
          "PARABÉNS! VOCÊ EXPLOROU TODO O ESPAÇO!",
          "/assets/common/trophy.png",
          "trophy",
        ),
      ],
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };

    gameRef.current = new Phaser.Game(config);

    const setupGame = () => {
      const scene = gameRef.current?.scene.scenes[1] as SpaceGameScene; // SpaceGameScene é a segunda cena
      if (scene && user?.codigo_usuario) {
        scene.setUserId(user.codigo_usuario.toString());
        scene.setActivityId(activityId);
      }
    };
    setTimeout(setupGame, 100);

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
