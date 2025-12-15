import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/sum/scenes/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface SumGameProps {
  activityId?: number;
}

const SumGame: React.FC<SumGameProps> = ({ activityId = 1 }) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#AED3E3",
    scene: [
      StartScene.create(
        "GameScene",
        "/assets/sumGame/FUNDO.png",
        "sumBackground",
        "JOGO DA SOMA",
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

export default SumGame;
