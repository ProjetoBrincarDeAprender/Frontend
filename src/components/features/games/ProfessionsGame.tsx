import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/professions/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

const ProfessionsGame: React.FC = () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#AED3E3",
    scene: [
      StartScene.create(
        "GameScene",
        "/assets/professions/bg.svg",
        "professionsBackground",
        "JOGO DAS PROFISSÕES",
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

export default ProfessionsGame;
