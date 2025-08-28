import { useEffect, useRef } from "react";
import Phaser from "phaser";
import Vowels from "@/games/vowels/Vowels";
import { Footer } from "@/components/footer/Footer";
import { EventBus } from "@/games/EventBus";
import { Button } from "@/components/ui/button";

export interface IRefVowelsGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

const VowelsGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [Vowels],
      parent: "game-container",
      backgroundColor: "#ffffff",
    };

    gameRef.current = new Phaser.Game(config);

    EventBus.on("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  const trocarImagem = () => {
    const scene = gameRef.current?.scene.getScene("Vowels") as any;
    scene.changeImage();
  };

  return (
    <>
      {/* <Header /> */}
      <div
        id="game-container"
        className="relative mt-5 mb-20 flex justify-center"
      >
        <Button
          onClick={() => trocarImagem()}
          className="absolute top-120 right-160 cursor-pointer"
        >
          Testing
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default VowelsGame;
