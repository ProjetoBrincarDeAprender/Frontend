import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/typesHousing/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

const HousingGame: React.FC = () => {
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
        // StartScene personalizada para Housing
        StartScene.create(
          "GameScene", // Vai para GameScene
          "/assets/housingGame/bg.svg", // Background do Housing
          "housingBackground", // Chave do background
          "TIPOS DE MORADIAS", // Título específico
        ),
        // GameScene (registra automaticamente as outras cenas padrão)
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
  }, [user]); // Housing Game não tem dependências externas

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

export default HousingGame;
