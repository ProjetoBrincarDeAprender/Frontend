import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import Level from "../../common/models/Level";
import EffectManager from "../../common/managers/EffectManager";
import Button from "@/games/common/models/Button";
import ButtonManager from "@/games/common/managers/ButtonManager";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private levelManager: LevelManager;
  private sequenceText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const levels: Level[] = [];
    levels.push(new Level("1, 2, 3, _", "4"));
    levels.push(new Level("2, 4, 6, _", "8"));
    levels.push(new Level("5, 6, 7, _", "8"));
    levels.push(new Level("10, 20, 30, _", "40"));

    this.levelManager = new LevelManager(levels);
    this.scene = scene;
    this.gameStats = new GameStats();
    this.effectManager = new EffectManager(this.scene);
    this.buttonManager = new ButtonManager(this.scene);
  }

  handleClick(
    button: Button,
    timeNow: number,
  ): { correct: boolean; finished: boolean } {
    const currentLevel: Level = this.levelManager.getCurrentLevel();
    const isCorrect: boolean = currentLevel.isCorrectLetter(
      button.getButtonStringText(),
    );
    if (isCorrect) {
      this.gameStats.addHitTime(timeNow);
      this.gameStats.addMissCount();
      this.gameStats.resetActualLevelMisses();

      const finished = !this.levelManager.nextLevel();
      return { correct: true, finished };
    } else {
      this.gameStats.addMiss();
      return { correct: false, finished: false };
    }
  }

  buttonSuccessEffect(
    button: Button,
    particleTexture?: string,
    successColor: number = 0x00ff00,
  ): void {
    this.effectManager.growup(button);
    this.effectManager.changeColor(button.getButtonText(), successColor);
    if (particleTexture) this.effectManager.particles(particleTexture);
  }

  buttonFailEffect(button: Button, failColor: number = 0xff0000): void {
    this.effectManager.growup(button, "Bounce", 1.2, 200);
    this.effectManager.changeColor(button.getButtonText(), failColor);
  }

  failEffect(): void {}

  accessCurrentLevel(): Level {
    return this.levelManager.getCurrentLevel();
  }

  isGameFinished(): boolean {
    if (this.levelManager.isFinished()) return true;
    return false;
  }

  setButtonTexts(): void {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts = this.buttonManager.generateButtonsNumbers(
      buttonsNumber,
      answer,
    );
    this.buttonManager.setButtonTexts(buttonTexts);
  }

  createSequenceDisplay(): void {
    // Adicionar fundo colorido suave
    this.scene.add.rectangle(400, 300, 760, 560, 0xe3f2fd, 0.8);

    // Título mais amigável e colorido
    this.scene.add
      .text(400, 120, "Qual número vem depois?", {
        fontSize: "36px",
        color: "#1976D2",
        fontFamily: "Arial Black",
        stroke: "#FFFFFF",
        strokeThickness: 4,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 3,
          fill: true,
        },
      })
      .setOrigin(0.5);
    // Caixa da sequência mais destacada
    const sequenceBox = this.scene.add.rectangle(400, 200, 500, 80, 0xffffff);
    sequenceBox.setStrokeStyle(4, 0x4caf50);

    this.sequenceText = this.scene.add
      .text(400, 200, "", {
        fontSize: "52px",
        color: "#2E7D32",
        fontFamily: "Arial Black",
        align: "center",
      })
      .setOrigin(0.5);
  }

  setSequenceText(sequence: string): void {
    if (this.sequenceText) this.sequenceText.setText(sequence);
  }

  createButtons(): void {
    const buttonPositions: { x: number; y: number }[] = [
      { x: 250, y: 350 },
      { x: 400, y: 350 },
      { x: 550, y: 350 },
    ];
    const buttonTextures: string[] = [
      "defaultButton",
      "hoverButton",
      "clickedButton",
    ];
    this.buttonManager.createButtons(buttonPositions, buttonTextures);

    // Adicionar instrução visual para os botões
    this.scene.add
      .text(400, 290, "Clique no número correto:", {
        fontSize: "24px",
        color: "#FF6F00",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
  }

  getButtons(): Button[] {
    return this.buttonManager.getButtons();
  }

  resetInitialLevelTime(newTime: number = 0): void {
    this.gameStats.resetInitialLevelTime(newTime);
  }
}
