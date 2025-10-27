import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import CoordinationGameScene from "@/games/coordination/scenes/GameScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import ClickButtonStartScene from "@/games/clickedButton/scenes/ClickButtonStart";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export const CoordinationGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const CoordinationStartScene = new ClickButtonStartScene(
      "/assets/forms/gameData/startData.JSON",
      "CoordinationGameScene",
    );

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [
        CoordinationStartScene,
        CoordinationGameScene,
        // Tela final comum com customização para o jogo de formas
        EndScene.create(
          "clickButtonStartScene",
          undefined,
          undefined,
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

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

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
