import { AudioManager as GlobalAudioManager } from "@/games/common/managers/AudioManager";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(): void {
    // Registra/recupera preferências globais de áudio e cria botão de mute
    new GlobalAudioManager(this, 0.7);

    // Registra cenas padrão apenas uma vez
    this.registerStandardScenes();
  }

  private registerStandardScenes(): void {
    // Próximo nível (volta para esta mesma cena)
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      const levelComplete = new LevelCompletedScene({
        nextLevelScene: "GameScene",
        menuScene: "StartScene",
        backgroundPath: "/assets/subtractionGame/background.png",
        backgroundKey: "subBackground",
        onMenuReturn: () => {
          this.registry.remove("subCurrentLevel");
          this.registry.remove("subUserId");
          this.registry.remove("subActivityId");
        },
      });
      this.scene.add("LevelCompleteScene", levelComplete);
    }

    // Fim de jogo
    if (!this.scene.manager.getScene("EndScene")) {
      const endScene = new EndScene({
        restartScene: "StartScene",
        backgroundPath: "/assets/subtractionGame/background.png",
        backgroundKey: "subBackground",
        subtitleMessage: "VOCÊ CONCLUIU A SUBTRAÇÃO!",
        onRestart: () => {
          this.registry.remove("subCurrentLevel");
          this.registry.remove("subUserId");
          this.registry.remove("subActivityId");
        },
      });
      this.scene.add("EndScene", endScene);
    }
  }

  preload(): void {
    // Assets mínimos para a tela e para o botão de áudio
    this.load.image("subBackground", "/assets/subtractionGame/background.png");
    this.load.image("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.image("audioOff", "/assets/common/buttons/audioOff.svg");
  }

  create(): void {
    // Fundo padrão 800x600 (mesmas dimensões usadas nos outros jogos)
    const bg = this.add.image(400, 300, "subBackground").setDepth(0);
    // Ajusta para preencher a área mantendo proporção
    bg.setDisplaySize(800, 600);

    // Marcador temporário para indicar que é apenas a casca do jogo
    this.add
      .text(400, 300, "Jogo de Subtração\n(em preparação)", {
        fontFamily: "Arial Black",
        fontSize: "28px",
        color: "#1f2937",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(5);
  }
}

export default GameScene;
