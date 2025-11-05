import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import CoordinationGameScene from "@/games/coordination/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export const CoordinationGame = ({
  activityId = 0 /* id do seu jogo */,
}: {
  activityId?: number;
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [
        // Tela inicial padronizada mantendo o background do jogo de formas
        StartScene.create(
          "CoordinationGameScene",
          "/assets/forms/bg2.png",
          "formsBg",
          "JOGO DAS FORMAS",
        ),
        CoordinationGameScene,
        // Tela de nível completo padronizada mantendo o background
        LevelCompletedScene.create(
          "CoordinationGameScene",
          "StartScene",
          "/assets/forms/bg.png",
          "formsBg",
        ),
        // Tela final comum com customização para o jogo de formas
        EndScene.create(
          "StartScene",
          "/assets/forms/bg.png",
          "formsBg",
          "VOCÊ COMPLETOU AS FORMAS!",
        ),
      ],
      parent: containerRef.current,
      backgroundColor: "#96D6F3",
      audio: {
        // Evita criação de AudioContext (WebAudio) e usa HTML5 Audio,
        // eliminando os avisos/erros de autoplay no console.
        disableWebAudio: true,
        noAudio: false,
      },
    };

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [user, activityId]);

  return (
    <>
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          ref={containerRef}
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        />
      </div>
      <Footer />
    </>
  );
};
