import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/armedSum/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

interface ArmedSumGameProps {
  activityId?: number;
}

const ArmedSumGame: React.FC<ArmedSumGameProps> = ({ activityId = 30 }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "armed-sum-game-container",
      backgroundColor: "#4ECDC4",
      scene: [
        StartScene.create(
          "GameScene",
          "/assets/armedSum/background.png",
          "armedSumBg",
          "CONTA ARMADA",
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
        scene.registry.remove("armedSumCurrentLevel");
        const userId = user?.codigo_usuario
          ? user.codigo_usuario.toString()
          : "10130001";
        scene.registry.set("armedSumUserId", userId);
        scene.registry.set("armedSumActivityId", activityId);
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
          id="armed-sum-game-container"
          className="relative"
          style={{ width: 800, height: 600 }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default ArmedSumGame;
