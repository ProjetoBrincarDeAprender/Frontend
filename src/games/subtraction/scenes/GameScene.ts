import { AudioManager as GlobalAudioManager } from "@/games/common/managers/AudioManager";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";
import MathLogic from "../logic/logic";
import SubtractionLevel, { LevelType } from "../logic/MathLevel";
import { AnimationManager } from "@/games/sum/components/animations/AnimationManager";
import { SubmitButton } from "@/games/sum/components/buttons/SubmitButton";
import { NumberDisplay } from "../components/ui/NumberDisplay";

export class GameScene extends Phaser.Scene {
  private logic!: MathLogic;
  private animationManager!: AnimationManager;
  private numberDisplay!: NumberDisplay;
  private answerText?: Phaser.GameObjects.Text;
  private equationText!: Phaser.GameObjects.Text;
  private equationBox?: Phaser.GameObjects.Graphics;
  private correctAnswer: number = 0;
  private currentLevel: SubtractionLevel | null = null;
  private inputText: string = "";
  private submitButton?: SubmitButton;
  private keyboardHandler?: (event: KeyboardEvent) => void;
  private choiceButtons: Phaser.GameObjects.Container[] = [];
  private cursor?: Phaser.GameObjects.Rectangle;
  private cursorTween?: Phaser.Tweens.Tween;
  private isTransitioning: boolean = false;
  private userId: string = "default_user";
  private activityId?: number;

  constructor() {
    super({ key: "GameScene" });
  }

  init(): void {
    // Registra/recupera preferências globais de áudio e cria botão de mute
    new GlobalAudioManager(this, 0.7);

    // Registra cenas padrão apenas uma vez
    this.registerStandardScenes();

    // Reset de estado
    this.inputText = "";
    this.correctAnswer = 0;
    this.currentLevel = null;
    this.choiceButtons = [];
    this.submitButton = undefined;
    this.keyboardHandler = undefined;
    this.cursor = undefined;
    this.cursorTween = undefined;
    this.answerText = undefined;
    this.isTransitioning = false;

    // Recuperar userId e activityId do registry (similar ao jogo de soma)
    this.userId = this.registry.get("subUserId") || "10130001";
    this.activityId = this.registry.get("subActivityId") || 59;
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
          // Limpar todos os dados do registry quando volta ao menu
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
          // Limpar todos os dados do registry quando reinicia
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

    // Reutilizando blocos numéricos do jogo de soma
    this.load.image("um", "/assets/sumGame/um.png");
    this.load.image("dois", "/assets/sumGame/dois.png");
    this.load.image("tres", "/assets/sumGame/tres.png");
    this.load.image("quatro", "/assets/sumGame/quatro.png");
    this.load.image("cinco", "/assets/sumGame/cinco.png");
    this.load.image("seis", "/assets/sumGame/seis.png");
    this.load.image("sete", "/assets/sumGame/sete.png");
    this.load.image("oito", "/assets/sumGame/oito.png");
    this.load.image("nove", "/assets/sumGame/nove.png");
    this.load.image("dez", "/assets/sumGame/dez.png");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image(
      "defaultButton",
      "/assets/common/buttons/squareBlueDefault.svg",
    );
    this.load.image(
      "hoverButton",
      "/assets/common/buttons/squareBlueHover.svg",
    );
    this.load.image(
      "clickedButton",
      "/assets/common/buttons/squareBlueClicked.svg",
    );

    // Níveis definidos via JSON externo (opcional)
    this.load.json("subLevels", "/assets/subtractionGame/levels.json");

    // Sons de acerto/erro
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
  }

  create(): void {
    this.clearScene();

    const bg = this.add.image(400, 300, "subBackground").setDepth(0);
    bg.setDisplaySize(800, 600);

    this.animationManager = new AnimationManager(this);
    this.numberDisplay = new NumberDisplay(this);

    this.initializeLogic();
    this.startLevel();
  }

  private initializeLogic() {
    const levels: SubtractionLevel[] = [];

    // Nível 1: 5 fases com múltipla escolha (números de 1 a 5, sem negativos)
    for (let i = 0; i < 5; i++) {
      let num1, num2;
      do {
        num1 = Phaser.Math.Between(1, 5);
        num2 = Phaser.Math.Between(1, 5);
      } while (num1 < num2); // Garantir que num1 >= num2 para evitar negativos

      levels.push(new SubtractionLevel(num1, num2, LevelType.MULTIPLE_CHOICE));
    }

    // Nível 2: 5 fases com input digitado (números de 1 a 5, sem negativos)
    for (let i = 0; i < 5; i++) {
      let num1, num2;
      do {
        num1 = Phaser.Math.Between(1, 5);
        num2 = Phaser.Math.Between(1, 5);
      } while (num1 < num2); // Garantir que num1 >= num2 para evitar negativos

      levels.push(new SubtractionLevel(num1, num2, LevelType.INPUT));
    }

    // Nível 3: 5 fases com dois números (primeiro de 1 a 10, segundo de 1 a 5, sem negativos)
    for (let i = 0; i < 5; i++) {
      let num1, num2;
      do {
        num1 = Phaser.Math.Between(1, 10);
        num2 = Phaser.Math.Between(1, 5);
      } while (num1 < num2); // Garantir que num1 >= num2 para evitar negativos

      levels.push(new SubtractionLevel(num1, num2, LevelType.INPUT));
    }

    const savedLevel = this.registry.get("subCurrentLevel") || 0;
    this.logic = new MathLogic(
      this,
      levels,
      this.userId,
      this.activityId,
      savedLevel,
    );
  }

  private startLevel() {
    this.clearScene();
    this.isTransitioning = false;
    this.currentLevel = this.logic.getCurrentLevel();
    if (!this.currentLevel) return;

    this.inputText = "";
    this.correctAnswer = this.currentLevel.getAnswer();

    this.createEquationDisplay(this.currentLevel);

    const numbersToDisplay = [
      this.currentLevel.number1,
      this.currentLevel.number2,
    ];
    if (
      this.currentLevel.isThreeNumbers() &&
      this.currentLevel.getNumber3() !== undefined
    ) {
      numbersToDisplay.push(this.currentLevel.getNumber3()!);
    }
    this.numberDisplay.display(numbersToDisplay);

    if (this.currentLevel.isMultipleChoice()) {
      this.createMultipleChoiceInterface(this.currentLevel);
    } else {
      this.createInputInterface();
    }
  }

  private createEquationDisplay(level: SubtractionLevel) {
    let equationString: string;
    let fontSize: string;
    if (level.isThreeNumbers() && level.getNumber3() !== undefined) {
      equationString = `${level.getNumber1()} - ${level.getNumber2()} - ${level.getNumber3()} = ?`;
      fontSize = "36px";
    } else {
      equationString = `${level.getNumber1()} - ${level.getNumber2()} = ?`;
      fontSize = "46px";
    }
    this.equationText = this.add
      .text(430, 250, equationString, {
        fontSize,
        color: "#F67800",
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5)
      .setDepth(13);

    this.createOrUpdateEquationBox();
  }

  private updateEquationWithCorrectAnswer() {
    if (!this.currentLevel) return;
    let equationString: string;
    let fontSize: string;
    if (
      this.currentLevel.isThreeNumbers() &&
      this.currentLevel.getNumber3() !== undefined
    ) {
      equationString = `${this.currentLevel.getNumber1()} - ${this.currentLevel.getNumber2()} - ${this.currentLevel.getNumber3()} = ${this.correctAnswer}`;
      fontSize = "36px";
    } else {
      equationString = `${this.currentLevel.getNumber1()} - ${this.currentLevel.getNumber2()} = ${this.correctAnswer}`;
      fontSize = "46px";
    }
    this.tweens.add({
      targets: this.equationText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      ease: "Back.easeOut",
      yoyo: true,
      onStart: () => {
        this.equationText.setTint(0x00ff00);
        this.equationText.setFontSize(fontSize);
      },
      onYoyo: () => {
        this.equationText.setText(equationString);
        this.createOrUpdateEquationBox();
      },
      onComplete: () => {
        this.time.delayedCall(2000, () => this.equationText.clearTint());
      },
    });
  }

  private createMultipleChoiceInterface(level: SubtractionLevel) {
    const choices = level.getChoices();
    if (!choices) return;
    const positions = [
      { x: 200, y: 480 },
      { x: 400, y: 480 },
      { x: 600, y: 480 },
    ];
    this.choiceButtons = [];
    choices.forEach((choice, idx) => {
      const container = this.add.container(positions[idx].x, positions[idx].y);
      const button = this.add.image(0, 0, "defaultButton").setInteractive();
      const text = this.add
        .text(0, 0, choice.toString(), {
          fontSize: "42px",
          color: "#000",
          fontFamily: "Arial Black",
        })
        .setOrigin(0.5);
      container.add([button, text]);
      container.setScale(1.3);
      this.choiceButtons.push(container);
      button.on("pointerdown", () => {
        if (this.isTransitioning) return;
        this.handleMultipleChoiceAnswer(choice, container);
      });
      button.on("pointerover", () => this.input.setDefaultCursor("pointer"));
      button.on("pointerout", () => this.input.setDefaultCursor("default"));
    });
  }

  private handleMultipleChoiceAnswer(
    selected: number,
    container: Phaser.GameObjects.Container,
  ) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    const idx = this.logic.getCurrentLevelIndex();
    const result = this.logic.checkAnswer(selected);
    this.choiceButtons.forEach((b) => b.disableInteractive());
    if (result.correct) {
      this.sound.play("correct");
      this.animationManager.correctAnswerEffect(container);
      this.animationManager.starExplosionEffect(container.x, container.y);
      this.updateEquationWithCorrectAnswer();
      this.proceedToNextLevel(idx);
    } else {
      this.sound.play("incorrect");
      this.animationManager.incorrectAnswerEffect(container);
      this.time.delayedCall(2000, () => {
        this.isTransitioning = false;
        this.choiceButtons.forEach((b) => b.setInteractive());
      });
    }
  }

  private createInputInterface() {
    if (this.answerText) this.answerText.destroy();
    if (this.submitButton) {
      this.submitButton.destroy();
      this.submitButton = undefined;
    }
    if (this.cursorTween) {
      this.cursorTween.stop();
      this.cursorTween = undefined;
    }
    if (this.cursor) {
      this.cursor.destroy();
      this.cursor = undefined;
    }

    this.add.text(60, 470, "DIGITE A RESPOSTA: ", {
      fontSize: "24px",
      color: "#000",
      fontFamily: "Arial Black",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 10 },
    });

    this.answerText = this.add
      .text(392, 500, " ", {
        fontSize: "48px",
        color: "#000",
        backgroundColor: "#ffffff",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(0.5);

    this.cursor = this.add.rectangle(0, 0, 2, 36, 0x000000).setOrigin(0, 0.5);
    this.cursor.setDepth(12);
    this.updateCursorPosition();
    this.cursorTween = this.tweens.add({
      targets: this.cursor,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.submitButton = new SubmitButton(this, 550, 500, () =>
      this.handleAnswer(),
    );
    this.setupKeyboardInput();
  }

  private setupKeyboardInput() {
    if (this.keyboardHandler)
      this.input.keyboard?.off("keydown", this.keyboardHandler);
    this.keyboardHandler = (event: KeyboardEvent) => {
      if (this.isTransitioning) return;
      if (event.key >= "0" && event.key <= "9") {
        if (this.inputText.length < 3) {
          // permitir negativos depois
          this.inputText += event.key;
          this.answerText!.setText(this.inputText);
          this.updateCursorPosition();
        }
      } else if (event.key === "-") {
        if (this.inputText.length === 0) {
          this.inputText = "-";
          this.answerText!.setText(this.inputText);
          this.updateCursorPosition();
        }
      } else if (event.key === "Backspace") {
        this.inputText = this.inputText.slice(0, -1);
        this.answerText!.setText(this.inputText);
        this.updateCursorPosition();
      } else if (event.key === "Enter") {
        this.handleAnswer();
      }
    };
    this.input.keyboard!.on("keydown", this.keyboardHandler);
  }

  private handleAnswer() {
    if (this.isTransitioning) return;
    const userAnswer = parseInt(this.inputText);
    if (isNaN(userAnswer)) return;
    this.isTransitioning = true;
    const idx = this.logic.getCurrentLevelIndex();
    const result = this.logic.checkAnswer(userAnswer);
    if (this.submitButton) this.submitButton.disableInteractive();
    if (result.correct) {
      this.sound.play("correct");
      this.animationManager.correctAnswerEffect(this.answerText!);
      this.animationManager.starExplosionEffect(
        this.answerText!.x,
        this.answerText!.y,
      );
      this.updateEquationWithCorrectAnswer();
      this.proceedToNextLevel(idx);
    } else {
      this.sound.play("incorrect");
      this.animationManager.incorrectAnswerEffect(this.answerText!);
      this.time.delayedCall(2000, () => {
        this.isTransitioning = false;
        this.resetInput();
        if (this.submitButton) this.submitButton.setInteractive();
      });
    }
  }

  private proceedToNextLevel(levelIndexBeforeIncrement: number) {
    this.time.delayedCall(3000, () => {
      const nextLevelIndex = levelIndexBeforeIncrement + 1;
      if (nextLevelIndex === 5) {
        this.registry.set("subCurrentLevel", nextLevelIndex);
        this.scene.start("LevelCompleteScene", {
          currentLevel: nextLevelIndex,
          completionMessage: "Ótimo! Agora vamos digitar as respostas!",
        });
      } else if (nextLevelIndex === 10) {
        this.registry.set("subCurrentLevel", nextLevelIndex);
        this.scene.start("LevelCompleteScene", {
          currentLevel: nextLevelIndex,
          completionMessage: "Perfeito! Agora vamos subtrair 3 números!",
        });
      } else if (nextLevelIndex >= 15) {
        this.registry.remove("subCurrentLevel");
        this.scene.start("EndScene");
      } else {
        this.registry.set("subCurrentLevel", nextLevelIndex);
        this.startLevel();
      }
    });
  }

  private resetInput() {
    this.inputText = "";
    if (this.answerText) this.answerText.setText("");
    if (this.cursor && this.answerText) {
      this.updateCursorPosition();
    }
  }

  private clearScene() {
    if (this.numberDisplay) this.numberDisplay.clear();
    this.choiceButtons.forEach((b) => b.destroy());
    this.choiceButtons = [];
    if (this.answerText) {
      this.answerText.destroy();
      this.answerText = undefined;
    }
    if (this.equationBox) {
      this.equationBox.destroy();
      this.equationBox = undefined;
    }
    if (this.submitButton) {
      this.submitButton.destroy();
      this.submitButton = undefined;
    }
    if (this.keyboardHandler) {
      this.input.keyboard?.off("keydown", this.keyboardHandler);
      this.keyboardHandler = undefined;
    }
    if (this.cursorTween) {
      this.cursorTween.stop();
      this.cursorTween = undefined;
    }
    if (this.cursor) {
      this.cursor.destroy();
      this.cursor = undefined;
    }
    if (this.equationText) {
      this.equationText.destroy();
    }
  }

  // Cria/atualiza uma caixa branca arredondada atrás do enunciado para melhorar a legibilidade
  private createOrUpdateEquationBox() {
    if (!this.equationText) return;
    const padding = 16;
    const b = this.equationText.getBounds();
    const width = b.width + padding * 2;
    const height = b.height + padding * 2;
    const x = b.centerX - width / 2;
    const y = b.centerY - height / 2;

    if (!this.equationBox) {
      this.equationBox = this.add.graphics();
    }
    this.equationBox.clear();
    this.equationBox.fillStyle(0xffffff, 1);
    this.equationBox.lineStyle(2, 0x000000, 1);
    this.equationBox.fillRoundedRect(x, y, width, height, 12);
    this.equationBox.strokeRoundedRect(x, y, width, height, 12);
    this.equationBox.setDepth(12);
  }

  private updateCursorPosition() {
    if (!this.answerText || !this.cursor || !this.answerText.scene) return;
    try {
      const bounds = this.answerText.getBounds();
      this.cursor.setPosition(bounds.left + 8, bounds.centerY);
    } catch (error) {
      console.warn("Erro ao atualizar posição do cursor:", error);
    }
  }
}

export default GameScene;
