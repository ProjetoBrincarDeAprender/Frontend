import { StartScene } from "@/games/common/scenes/StartScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#87CEEB",
  scene: [StartScene, GameScene, LevelCompletedScene, EndScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default function startLocationsGame(): Phaser.Game {
  return new Phaser.Game(config);
}