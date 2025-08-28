import { useEffect, useRef, useState } from "react";
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
  const [letters, setLetters] = useState<string[]>([]);

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

  useEffect(() => {
    EventBus.on("letras-definidas", (array: string[]) => {
      setLetters(array);
    });
  }, [letters]);

  const clickButton = (letter: string) => {
    const scene = gameRef.current?.scene.getScene("Vowels") as any;
    scene.changeLevel(letter);
  };

  return (
    <>
      {/* <Header /> */}
      <div
        id="game-container"
        className="relative mt-5 mb-20 flex justify-center"
      >
        <Button
          onClick={() => clickButton("A")}
          className="absolute top-120 right-160 cursor-pointer"
        >
          {letters[0]}
        </Button>
        <Button
          onClick={() => clickButton("E")}
          className="absolute top-120 right-120 cursor-pointer"
        >
          {letters[1]}
        </Button>
        <Button
          onClick={() => clickButton("a")}
          className="absolute top-120 right-80 cursor-pointer"
        >
          {letters[2]}
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default VowelsGame;
