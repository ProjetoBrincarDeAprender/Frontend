import { StartScene } from "@/games/common/scenes/StartScene";
import { GameScene } from "@/games/typesHousing/scenes/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

const HousingGame: React.FC = () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#AED3E3",
    scene: [
      // StartScene personalizada para Housing
      StartScene.create(
        "GameScene", // Vai para GameScene
        "/assets/housingGame/bg.svg", // Background do Housing
        "housingBackground", // Chave do background
        "TIPOS DE MORADIAS", // Título específico
      ),
      // GameScene (registra automaticamente as outras cenas padrão)
      GameScene,
    ],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  return <GameWrapper gameConfig={config} />;
};

export default HousingGame;
