import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import Level from "../../common/models/Level";
import Phaser from "phaser";
import ButtonContentGenerator from "@/games/common/content/ButtonContentGenerator";
import api from "@/utils/api";
import NumbersStrategy from "@/games/common/content/NumbersStrategy";

export default class Logic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private levelManager: LevelManager<Level>;
  private sequenceBoxes: Phaser.GameObjects.GameObject[] = [];
  private missingBoxGraphics?: Phaser.GameObjects.Graphics;
  private missingBoxText?: Phaser.GameObjects.Text;
  private lastCorrectAnswer?: string;

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
      // Guarda a resposta correta deste nível para exibi-la antes de avançar
      this.lastCorrectAnswer = currentLevel.getAnswer();
      // Envia dados desta tentativa correta antes de atualizar os contadores
      this.sendData();

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

  private sendData = async () => {
    try {
      const levelData = {
        activityId: 4, // Sequência numérica
        questionId: this.levelManager.getCurrentIndex(),
        isCorrect: true,
        answer: this.accessCurrentLevel().getAnswer(),
        timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
        attempts: this.gameStats.getCurrentLevelMisses(),
        responseDate: this.scene.time.now,
      };

      // console.log("Sending numbers level data:", levelData);

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        levelData,
        {},
      );

      if (response.status === 201) {
        // console.log("Numbers data sent successfully");
      }
    } catch (error) {
      // console.log(error);
    }
  };

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
    // Aumenta levemente o botão, pinta o texto e o fundo de vermelho
    this.effectManager.growup(button, "Bounce", 1.2, 200);
    this.effectManager.changeColor(button.getButtonText(), failColor);
    // Pinta o botão de vermelho no erro
    button.setTint(failColor);
    // Remove o tint após um curto intervalo para não persistir entre níveis
    this.scene.time.delayedCall(500, () => button.clearTint());
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
    const buttonContentGenerator = new ButtonContentGenerator(
      new NumbersStrategy(),
    );
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts = buttonContentGenerator.generate(buttonsNumber, answer);
    this.buttonManager.setButtonTexts(buttonTexts);
  }

  createSequenceDisplay(): void {
    // Imagem de fundo ocupando toda a tela
    const background = this.scene.add.image(400, 300, "numbersBackground");
    background.setDisplaySize(800, 600);

    // Container com cor que harmoniza com o fundo
    const container = this.scene.add.graphics();
    container.fillStyle(0x1e1b4b, 0.95); // Roxo escuro com 80% de opacidade
    container.fillRoundedRect(50, 50, 700, 500, 25);

    // Título em CAPSLOCK para pessoas com síndrome de Down
    this.scene.add
      .text(400, 130, "COMPLETE A SEQUÊNCIA", {
        fontSize: "38px",
        color: "#4f46e5",
        fontFamily: "Arial Black",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "rgba(0,0,0,0.5)",
          blur: 3,
          fill: true,
        },
      })
      .setOrigin(0.5);
  }

  setSequenceText(sequence: string): void {
    // Limpar caixas anteriores
    this.sequenceBoxes.forEach((box) => box.destroy());
    this.sequenceBoxes = [];
    this.missingBoxGraphics = undefined;
    this.missingBoxText = undefined;

    // Remove vírgulas da sequência antes de processar
    const sequenceWithoutCommas = sequence.replace(/,/g, "");
    const numbers = sequenceWithoutCommas.trim().split(/\s+/);

    // Posições para as caixas da sequência
    const spacing = 55;
    const startX = 400 - ((numbers.length - 1) * spacing) / 2;
    const y = 220;

    numbers.forEach((num, index) => {
      const x = startX + index * spacing;

      if (num === "_") {
        // Caixa vazia para o próximo número
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xff6b6b, 0.8);
        graphics.fillRoundedRect(x - 25, y - 25, 50, 50, 10);
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.strokeRoundedRect(x - 25, y - 25, 50, 50, 10);

        // Ponto de interrogação
        const questionMark = this.scene.add
          .text(x, y, "?", {
            fontSize: "32px",
            color: "#ffffff",
            fontFamily: "Arial Black",
            fontStyle: "bold",
          })
          .setOrigin(0.5);

        this.sequenceBoxes.push(graphics, questionMark);
        // Guardar referências para poder substituir pelo número correto
        this.missingBoxGraphics = graphics;
        this.missingBoxText = questionMark;
      } else {
        // Caixas dos números
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x3b82f6, 0.9);
        graphics.fillRoundedRect(x - 25, y - 25, 50, 50, 10);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRoundedRect(x - 25, y - 25, 50, 50, 10);

        // Número em CAPSLOCK (mesmo que seja número)
        const numberText = this.scene.add
          .text(x, y, num.toString(), {
            fontSize: "28px",
            color: "#ffffff",
            fontFamily: "Arial Black",
            fontStyle: "bold",
          })
          .setOrigin(0.5);

        this.sequenceBoxes.push(graphics, numberText);
      }
    });

    // Instrução em CAPSLOCK
    const instruction = this.scene.add
      .text(400, 300, "ESCOLHA O PRÓXIMO NÚMERO:", {
        fontSize: "24px",
        color: "#4f46e5",
        fontFamily: "Arial Black",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.sequenceBoxes.push(instruction);
  }

  // Revela o número correto no lugar do "?" ao acertar
  revealAnswer(): void {
    const answer =
      this.lastCorrectAnswer || this.accessCurrentLevel().getAnswer();
    if (this.missingBoxGraphics) {
      // Redesenha a caixa como correta (verde) e borda branca
      this.missingBoxGraphics.clear();
      this.missingBoxGraphics.fillStyle(0x22c55e, 0.95); // verde de sucesso
      // Para manter a posição, obtemos x/y do texto vinculado
      const text = this.missingBoxText;
      if (text) {
        const x = text.x;
        const y = text.y;
        this.missingBoxGraphics.fillRoundedRect(x - 25, y - 25, 50, 50, 10);
        this.missingBoxGraphics.lineStyle(2, 0xffffff, 1);
        this.missingBoxGraphics.strokeRoundedRect(x - 25, y - 25, 50, 50, 10);
      }
    }
    if (this.missingBoxText) {
      this.missingBoxText.setText(answer);
      this.missingBoxText.setStyle({ fontSize: "28px", color: "#ffffff" });
      // Pequena animação de destaque
      this.scene.tweens.add({
        targets: this.missingBoxText,
        scale: { from: 0.9, to: 1.1 },
        duration: 150,
        yoyo: true,
        ease: "Back.easeOut",
      });
    }
  }

  createButtons(): void {
    const buttonPositions: { x: number; y: number }[] = [
      { x: 250, y: 390 },
      { x: 400, y: 390 },
      { x: 550, y: 390 },
    ];
    const buttonTextures = {
      default: "defaultButton",
      hover: "hoverButton",
      clicked: "clickedButton",
    };

    const buttonConfigs = buttonPositions.map((pos) => ({
      positions: pos,
      textures: buttonTextures,
    }));

    this.buttonManager.createButtons(buttonConfigs);
  }

  getButtons(): Button[] {
    return this.buttonManager.getButtons();
  }

  resetInitialLevelTime(newTime: number = 0): void {
    this.gameStats.resetInitialLevelTime(newTime);
  }

  // Utilitários para a cena enviar telemetria periódica (similar ao Memory)
  getCurrentLevelTime(): number {
    return this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now);
  }

  getCurrentLevelMisses(): number {
    return this.gameStats.getCurrentLevelMisses();
  }

  getCurrentAttempts(): number {
    return (
      this.gameStats.missCounts.reduce((total, misses) => total + misses, 0) +
      this.gameStats.getCurrentLevelMisses()
    );
  }

  getCurrentIndex(): number {
    return this.levelManager.getCurrentIndex();
  }
}
