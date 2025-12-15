import { EndScene } from "@/games/common/scenes/EndScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { GameWrapper } from "./GameWrapper";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import ConsonantSelectionScene from "@/games/common/content/ConsonantSelectionScene";
import Phaser from "phaser";

const ComplexSyllableGame: React.FC = () => {
  const startScene = new StartScene({
    nextSceneName: "ConsonantSelectionScene",
    backgroundPath: "/assets/complexSyllableGame/images/backgroundMain.png",
    backgroundKey: "startBg",
    gameTitle: "SÍLABAS COMPLEXAS",
  });

  const consonantSelectionScene = new ConsonantSelectionScene({
    backgroundPath: "/assets/complexSyllableGame/images/backgroundMain.png",
    backgroundKey: "consonantSelectionBg",
    nextSceneName: "clickButtonGameScene",
    title: "ESCOLHA UM DÍGRAFO",
    complex: true,
  });

  const gameScene = new ClickButtonGameScene();

  const endScene = new EndScene({
    restartScene: "ConsonantSelectionScene",
    backgroundPath: "/assets/complexSyllableGame/images/backgroundMain.png",
    backgroundKey: "endBg",
  });

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [startScene, consonantSelectionScene, gameScene, endScene],
    backgroundColor: "#ffffff",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} />;
};

export default ComplexSyllableGame;
