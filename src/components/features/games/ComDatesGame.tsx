import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { ComDatesHistoryScene } from "@/games/comDates/scenes/ComDatesHistoryScene";
import { ComDatesGameScene } from "@/games/comDates/scenes/ComDatesLevelScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefComDatesGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface ComDatesGameProps {
  activityId?: number;
}

export const ComDatesGame = ({ activityId = 7 }: ComDatesGameProps) => {
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
          "ComDatesHistoryScene",
          "/assets/comDatesGame/background.png",
          "background",
          "JOGO DAS DATAS\nCOMEMORATIVAS",
          "/assets/comDatesGame/mascot.png",
          "mascot",
        ),
        ComDatesHistoryScene,
        ComDatesGameScene,
        LevelCompletedScene.create(
          "ComDatesGameScene",
          "StartScene",
          "/assets/comDatesGame/background.png",
          "background",
          "/assets/comDatesGame/mascot.png",
          "mascot",
          "EVENTOS CONHECIDOS!",
        ),
        EndScene.create(
          "StartScene",
          "/assets/comDatesGame/background.png",
          "background",
          "PARABÉNS!\nVOCÊ EXPLOROU TODAS AS DATAS!",
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
