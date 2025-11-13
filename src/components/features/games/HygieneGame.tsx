import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { HygieneHistoryScene } from "@/games/hygiene/scenes/HygieneHistoryScene";
import { HygieneGameScene } from "@/games/hygiene/scenes/HygieneLevelScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefHygieneGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface HygieneGameProps {
  activityId?: number;
}

export const HygieneGame = ({ activityId = 5 }: HygieneGameProps) => {
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
          "HygieneHistoryScene",
          "/assets/hygieneGame/background.png",
          "background",
          "JOGO DA \nHIGIENE PESSOAL",
          "/assets/hygieneGame/mascot.png",
          "mascot",
        ),
        HygieneHistoryScene,
        HygieneGameScene,
        LevelCompletedScene.create(
          "HygieneGameScene",
          "StartScene",
          "/assets/hygieneGame/background.png",
          "background",
          "/assets/hygieneGame/mascot.png",
          "mascot",
          "PARABÉNS! \n VOCÊ CUIDOU BEM DA SUA HIGIENE!",
        ),
        EndScene.create(
          "StartScene",
          "/assets/hygieneGame/background.png",
          "background",
          "PARABÉNS!\nVOCÊ APRENDEU A CUIDAR\nDA SUA HIGIENE!",
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
