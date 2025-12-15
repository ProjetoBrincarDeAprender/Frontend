import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/subtraction/scenes/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface SubtractionGameProps {
  activityId?: number;
}

const SubtractionGame: React.FC<SubtractionGameProps> = ({
  activityId = 1,
}) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "subtraction-game-container",
    backgroundColor: "#AED3E3",
    scene: [
      StartScene.create(
        "GameScene",
        "/assets/subtractionGame/background.png",
        "subBackground",
        "JOGO DA SUBTRAÇÃO",
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

export default SubtractionGame;
