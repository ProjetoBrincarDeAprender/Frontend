import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import Level from "../../common/models/Level";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private levelManager: LevelManager<Level>;
  private sequenceBoxes: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    const levels: Level[] = [];

    // Nivel 1
    levels.push(new Level("1, 2, 3, _", "4"));
    levels.push(new Level("3, 4, 5, _", "6"));
    levels.push(new Level("6, 7, 8, _", "9"));
    levels.push(new Level("2, 3, 4, _", "5"));
    levels.push(new Level("5, 6, 7, _", "8"));

    // Nivel 2
    levels.push(new Level("10, 11, 12, _", "13"));
    levels.push(new Level("15, 16, 17, _", "18"));
    levels.push(new Level("12, 13, 14, _", "15"));
    levels.push(new Level("17, 18, 19, _", "20"));
    levels.push(new Level("11, 12, 13, _", "14"));

    // Nivel 3
    levels.push(new Level("10, 12, 14, _", "16"));
    levels.push(new Level("16, 18, 20, _", "22"));
    levels.push(new Level("11, 13, 15, _", "17"));
    levels.push(new Level("20, 23, 26, _", "29"));
    levels.push(new Level("15, 17, 19, _", "21"));

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
    // Fundo principal ocupando toda a tela sem bordas
    const gradient = this.scene.add.graphics();
    gradient.fillGradientStyle(0x1a237e, 0x3f51b5, 0x1a237e, 0x3f51b5, 1);
    gradient.fillRect(0, 0, 800, 600);

    // Área central com design moderno
    const centralArea = this.scene.add.graphics();
    centralArea.fillStyle(0xfafafa, 0.95);
    centralArea.fillRoundedRect(60, 60, 680, 480, 20);

    // Título com estilo mais sofisticado
    this.scene.add
      .text(400, 140, "Qual número vem depois?", {
        fontSize: "42px",
        color: "#2e3192",
        fontFamily: "Georgia, serif",
        fontStyle: "bold",
        stroke: "#ffffff",
        strokeThickness: 3,
        shadow: {
          offsetX: 1,
          offsetY: 2,
          color: "rgba(0,0,0,0.3)",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Linha decorativa sob o título
    const decorativeLine = this.scene.add.graphics();
    decorativeLine.lineStyle(3, 0x7986cb, 1);
    decorativeLine.moveTo(300, 165);
    decorativeLine.lineTo(500, 165);
    decorativeLine.strokePath();
  }

  setSequenceText(sequence: string): void {
    // Limpar caixas anteriores
    this.sequenceBoxes.forEach((box) => box.destroy());
    this.sequenceBoxes = [];

    // Remove vírgulas da sequência antes de processar
    const sequenceWithoutCommas = sequence.replace(/,/g, "");
    const numbers = sequenceWithoutCommas.trim().split(/\s+/);

    // Posições para as caixas da sequência com espaçamento elegante
    const spacing = 110;
    const startX = 400 - ((numbers.length - 1) * spacing) / 2;
    const y = 220;

    numbers.forEach((num, index) => {
      const x = startX + index * spacing;

      if (num === "_") {
        // Caixa vazia estática e elegante
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(3, 0x5c6bc0, 1);
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillRoundedRect(x - 40, y - 40, 80, 80, 15);
        graphics.strokeRoundedRect(x - 40, y - 40, 80, 80, 15);

        this.sequenceBoxes.push(graphics);
      } else {
        // Caixas dos números com design elegante
        const graphics = this.scene.add.graphics();
        graphics.fillGradientStyle(0x3f51b5, 0x5c6bc0, 0x3f51b5, 0x5c6bc0, 1);
        graphics.fillRoundedRect(x - 40, y - 40, 80, 80, 15);
        graphics.lineStyle(2, 0x283593, 1);
        graphics.strokeRoundedRect(x - 40, y - 40, 80, 80, 15);

        // Highlight superior para efeito 3D
        const highlight = this.scene.add.graphics();
        highlight.fillStyle(0xffffff, 0.3);
        highlight.fillRoundedRect(x - 38, y - 38, 76, 25, 12);

        const numberText = this.scene.add
          .text(x, y, num, {
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            color: "#ffffff",
            fontStyle: "bold",
            stroke: "rgba(0,0,0,0.3)",
            strokeThickness: 2,
          })
          .setOrigin(0.5);

        this.sequenceBoxes.push(graphics, highlight, numberText);
      }
    });
  }

  createButtons(): void {
    // Área dos botões com design sofisticado
    const buttonArea = this.scene.add.graphics();
    buttonArea.fillStyle(0xf8f9fa, 0.7);
    buttonArea.fillRoundedRect(150, 320, 500, 120, 15);
    buttonArea.lineStyle(1, 0xdee2e6, 1);
    buttonArea.strokeRoundedRect(150, 320, 500, 120, 15);

    // Instrução com tipografia elegante
    this.scene.add
      .text(400, 340, "Escolha o número correto:", {
        fontSize: "22px",
        color: "#495057",
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    const buttonPositions: { x: number; y: number }[] = [
      { x: 250, y: 390 },
      { x: 400, y: 390 },
      { x: 550, y: 390 },
    ];
    const buttonTextures: string[] = [
      "defaultButton",
      "hoverButton",
      "clickedButton",
    ];
    this.buttonManager.createButtons(buttonPositions, buttonTextures);

    // Adicionar efeitos visuais aos botões criados
    this.getButtons().forEach((button, index) => {
      // Sombra sutil para os botões
      const shadow = this.scene.add.graphics();
      shadow.fillStyle(0x000000, 0.1);
      shadow.fillRoundedRect(
        buttonPositions[index].x - 37,
        buttonPositions[index].y - 32,
        74,
        64,
        8,
      );

      // Inserir a sombra atrás do botão
      this.scene.children.bringToTop(button);
    });
  }

  getButtons(): Button[] {
    return this.buttonManager.getButtons();
  }

  resetInitialLevelTime(newTime: number = 0): void {
    this.gameStats.resetInitialLevelTime(newTime);
  }
}
