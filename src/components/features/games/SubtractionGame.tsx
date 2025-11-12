import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/subtraction/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

interface SubtractionGameProps {
  activityId?: number;
}

// Casca inicial do jogo de subtração, replicando estrutura do SumGame
// Ainda sem lógica: somente StartScene + GameScene placeholders
const SubtractionGame: React.FC<SubtractionGameProps> = ({
  activityId = 1,
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "subtraction-game-container",
      backgroundColor: "#AED3E3",
      scene: [
        StartScene.create(
          "GameScene",
          "/assets/subtractionGame/background.png",
          "subBackground",
          "JOGO DA SUBTRAÇÃO",
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
        scene.registry.remove("subCurrentLevel");
        const userId = user?.codigo_usuario
          ? user.codigo_usuario.toString()
          : "10130001";
        scene.registry.set("subUserId", userId);
        scene.registry.set("subActivityId", activityId);
      }
    };
    setTimeout(setupGame, 100);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }
  }, [user, activityId]);

  return (
    <>
      <div className="mt-28 mb-10 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          id="subtraction-game-container"
          className="relative"
          style={{ width: 800, height: 600 }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default SubtractionGame;
