import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameWrapper } from "./GameWrapper";
import CoordinationGameScene from "@/games/coordination/scenes/GameScene";
import Phaser from "phaser";

export const CoordinationGame = ({
  activityId = 0 /* id do seu jogo */,
}: {
  activityId?: number;
}) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
      // Tela inicial padronizada mantendo o background do jogo de formas
      StartScene.create(
        "CoordinationGameScene",
        "/assets/forms/bg2.png",
        "formsBg",
        "JOGO DAS FORMAS",
      ),
      CoordinationGameScene,
      // Tela de nível completo padronizada mantendo o background
      LevelCompletedScene.create(
        "CoordinationGameScene",
        "StartScene",
        "/assets/forms/bg.png",
        "formsBg",
      ),
      // Tela final comum com customização para o jogo de formas
      EndScene.create(
        "StartScene",
        "/assets/forms/bg.png",
        "formsBg",
        "VOCÊ COMPLETOU AS FORMAS!",
      ),
    ],
    backgroundColor: "#96D6F3",
    audio: {
      // Evita criação de AudioContext (WebAudio) e usa HTML5 Audio,
      // eliminando os avisos/erros de autoplay no console.
      disableWebAudio: true,
      noAudio: false,
    },
  };

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
