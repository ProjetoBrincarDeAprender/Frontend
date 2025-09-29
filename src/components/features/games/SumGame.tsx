import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import MathGame from "@/games/sum/scenes/GameScene";
import { SumLevelCompleteScene } from "@/games/sum/scenes/LevelCompleteScene";
import { useUser } from "@/hooks/User/useUser";
import { Footer } from "@/components/Footer/Footer";
import { BackButton } from "@/components/utils/BackButton";
import { Header } from "@/components/Header/Header";

interface SumGameProps {
  activityId?: number;
}

const SumGame: React.FC<SumGameProps> = ({ activityId = 1 }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current) return; 

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#AED3E3",
      scene: [MathGame, SumLevelCompleteScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH, 
      },
    };

    gameRef.current = new Phaser.Game(config);

    const setupGame = () => {
      const scene = gameRef.current?.scene.scenes[0] as MathGame;
      if (scene && user?.codigo_usuario) {
        scene.setUserId(user.codigo_usuario.toString());
        scene.setActivityId(activityId);
      }
    };
    setTimeout(setupGame, 100);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
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
