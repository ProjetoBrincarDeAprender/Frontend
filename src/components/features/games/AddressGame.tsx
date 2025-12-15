import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/address/scenes/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

const AddressGame: React.FC = () => {
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

  return <GameWrapper gameConfig={config} />;
};

export default AddressGame;
