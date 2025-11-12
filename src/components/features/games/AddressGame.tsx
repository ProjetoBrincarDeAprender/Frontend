import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/address/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

const AddressGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#87CEEB",
      scene: [
        StartScene.create(
          "GameScene",
          "/assets/addressGame/bg.svg",
          "locationsBackground",
          "RUAS E BAIRROS",
          "/assets/common/trophy.png",
          "trophy",
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

export default AddressGame;