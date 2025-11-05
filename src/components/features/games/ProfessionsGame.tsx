import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/professions/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

const ProfessionsGame: React.FC = () => {
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
      scene: [
        StartScene.create(
          "GameScene",
          "/assets/professions/bg.svg",
          "professionsBackground",
          "JOGO DAS PROFISSÕES",
        ),
        GameScene,
      ],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [user]);

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

export default ProfessionsGame;
