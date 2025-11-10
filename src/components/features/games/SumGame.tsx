import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/sum/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

interface SumGameProps {
  activityId?: number;
}

const SumGame: React.FC<SumGameProps> = ({ activityId = 1 }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#AED3E3",
      scene: [
        StartScene.create(
          "GameScene",
          "/assets/sumGame/FUNDO.png",
          "sumBackground",
          "JOGO DA SOMA",
        ),
        GameScene,
      ],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    const setupGame = () => {
      const scene = gameRef.current?.scene.getScene("StartScene") as StartScene;
      if (scene) {
        // Limpar qualquer progresso anterior quando inicia novo jogo
        scene.registry.remove("sumCurrentLevel");

        // Configurar dados do jogo
        const userId = user?.codigo_usuario
          ? user.codigo_usuario.toString()
          : "10130001";
        scene.registry.set("sumUserId", userId);
        scene.registry.set("sumActivityId", activityId);
      }
    };
    setTimeout(setupGame, 100);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    // return () => {
    //   gameRef.current?.destroy(true);
    //   gameRef.current = null;
    // };
  }, [user, activityId]);

  return (
    <>
      <div className="mt-28 mb-10 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          id="game-container"
          className="relative"
          style={{ width: 800, height: 600 }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default SumGame;
