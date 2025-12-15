import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/armedSum/scenes/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface ArmedSumGameProps {
  activityId?: number;
}

const ArmedSumGame: React.FC<ArmedSumGameProps> = ({ activityId = 4 }) => {
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

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};

export default ArmedSumGame;
