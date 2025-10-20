import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import CoordinationGameScene from "@/games/coordination/scenes/GameScene";
import CoordinationEndScene from "@/games/coordination/scenes/EndScene";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export const CoordinationGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [CoordinationGameScene, CoordinationEndScene],
      parent: "coordination-game-container",
      backgroundColor: "#96D6F3",
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
          id="coordination-game-container"
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        />
      </div>
      <Footer />
    </>
  );
};
