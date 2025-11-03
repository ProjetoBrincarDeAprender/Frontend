import { AudioManager as GlobalAudioManager } from "@/games/common/managers/AudioManager";
import Phaser from "phaser";
import Button from "../../common/models/Button";
import MathLevel, { LevelType } from "../MathLevel";
import { AudioManager } from "../audio/AudioManager";
import { AnimationManager } from "../components/animations/AnimationManager";
import { SubmitButton } from "../components/buttons/SubmitButton";
import { NumberDisplay } from "../components/ui/NumberDisplay";
import MathLogic from "../logic/logic";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { EndScene } from "@/games/common/scenes/EndScene";

export class GameScene extends Phaser.Scene {
  private logic!: MathLogic;
  private audioManager!: AudioManager;
  private animationManager!: AnimationManager;
  private numberDisplay!: NumberDisplay;
  private answerText?: Phaser.GameObjects.Text;
  private equationText!: Phaser.GameObjects.Text;
  private correctAnswer: number = 0;
  private currentLevel: MathLevel | null = null;
  private inputText: string = "";
  private userId: string = "default_user";
  private activityId?: number;
  private choiceButtons: Button[] = [];
  private submitButton?: SubmitButton;
  private keyboardHandler?: (event: KeyboardEvent) => void;
  private cursor?: Phaser.GameObjects.Rectangle;
  private cursorTween?: Phaser.Tweens.Tween;
  private isTransitioning: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
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
    
    this.userId = this.registry.get('sumUserId') || '10130001';
    this.activityId = this.registry.get('sumActivityId') || 1;
    
    new GlobalAudioManager(this);
    this.registerStandardScenes();
  }

  private registerStandardScenes(): void {

    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      const sumLevelComplete = new LevelCompletedScene({
        nextLevelScene: "GameScene",
        menuScene: "StartScene",
        backgroundPath: "/assets/sumGame/FUNDO.png",
        backgroundKey: "sumBackground",
        onMenuReturn: () => {
          // Limpar todos os dados do registry quando volta ao menu
          this.registry.remove('sumCurrentLevel');
          this.registry.remove('sumUserId');
          this.registry.remove('sumActivityId');
        }
      });
      this.scene.add("LevelCompleteScene", sumLevelComplete);
    }

    if (!this.scene.manager.getScene("EndScene")) {
      const sumEndScene = new EndScene({
        restartScene: "StartScene",
        backgroundPath: "/assets/sumGame/FUNDO.png",
        backgroundKey: "sumBackground",
        subtitleMessage: "VOCÊ AJUDOU O SAPINHO!",
        onRestart: () => {
          // Limpar todos os dados do registry quando reinicia
          this.registry.remove('sumCurrentLevel');
          this.registry.remove('sumUserId');
          this.registry.remove('sumActivityId');
        }
      });
      this.scene.add("EndScene", sumEndScene);
    }
  }

  preload() {
    this.loadAssets();
    
    if (!this.audioManager) {
      this.audioManager = new AudioManager(this);
    }
    this.audioManager.preloadSounds();
  }

  private loadAssets() {
    this.load.image("sumBackground", "/assets/sumGame/FUNDO.png");
    this.load.image("frog", "/assets/sumGame/sapita.png");
    this.load.image("sapoFala", "/assets/sumGame/sapita-fala.png");
    this.load.image("um", "/assets/sumGame/um.png");
    this.load.image("dois", "/assets/sumGame/dois.png");
    this.load.image("tres", "/assets/sumGame/tres.png");
    this.load.image("quatro", "/assets/sumGame/quatro.png");
    this.load.image("cinco", "/assets/sumGame/cinco.png");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("sumTrophy", "/assets/common/trophy.png");
    this.load.image("defaultButton", "/assets/common/buttons/squareBlueDefault.svg");
    this.load.image("hoverButton", "/assets/common/buttons/squareBlueHover.svg");
    this.load.image("clickedButton", "/assets/common/buttons/squareBlueClicked.svg");
  }

  create() {
    // Garantir que começamos com estado limpo
    this.clearScene();
    
    this.initializeManagers();
    this.initializeLogic();
    this.setupBackground();
    this.startLevel();
  }

  private initializeManagers() {
    if (this.audioManager) {
      this.audioManager.createSounds();
    }
    this.animationManager = new AnimationManager(this);
    this.numberDisplay = new NumberDisplay(this);
  }

  private initializeLogic() {
    const levels: MathLevel[] = [];

    for (let i = 0; i < 5; i++) {
      levels.push(
        new MathLevel(
          Phaser.Math.Between(1, 3),
          Phaser.Math.Between(1, 5),
          LevelType.MULTIPLE_CHOICE,
        ),
      );
    }

    for (let i = 0; i < 5; i++) {
      levels.push(
        new MathLevel(
          Phaser.Math.Between(1, 5),
          Phaser.Math.Between(1, 5),
          LevelType.INPUT,
        ),
      );
    }

    for (let i = 0; i < 5; i++) {
      levels.push(
        new MathLevel(
          Phaser.Math.Between(1, 5),
          Phaser.Math.Between(1, 5),
          LevelType.THREE_NUMBERS,
          Phaser.Math.Between(1, 5)
        ),
      );
    }

    // Pegar o nível salvo do registry, se existir
    const savedLevel = this.registry.get('sumCurrentLevel') || 0;
    this.logic = new MathLogic(this, levels, this.userId, this.activityId, savedLevel);
  }

  private setupBackground() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xAED3E3
    );
  }

  private startLevel() {
    this.clearScene();
    this.isTransitioning = false;
    
    if (!this.logic) {
      console.error("Logic não foi inicializado");
      return;
    }
    
    this.currentLevel = this.logic.getCurrentLevel();
    if (!this.currentLevel) {
      console.error("Nível atual não encontrado");
      return;
    }

    this.inputText = "";
    this.correctAnswer = this.currentLevel.getAnswer();

    this.createLevelBackground();
    this.createEquationDisplay(this.currentLevel);
    
    if (this.numberDisplay) {
      const numbersToDisplay = [this.currentLevel.number1, this.currentLevel.number2];
      
      const number3 = this.currentLevel.getNumber3();
      if (this.currentLevel.isThreeNumbers() && number3 !== undefined) {
        numbersToDisplay.push(number3);
      }
      
      this.numberDisplay.display(numbersToDisplay);
    }

    if (this.currentLevel.isMultipleChoice()) {
      this.createMultipleChoiceInterface(this.currentLevel);
    } else {
      this.createInputInterface();
    }
  }

  private createLevelBackground() {
    this.add.image(400, 300, "sumBackground").setDisplaySize(800, 600);
    this.add.image(380, 360, "sapoFala").setScale(1.0);
  }

  private createEquationDisplay(level: MathLevel) {
    let equationString: string;
    let fontSize: string;
    
    if (level.isThreeNumbers() && level.getNumber3() !== undefined) {
      equationString = `${level.getNumber1()} + ${level.getNumber2()} + ${level.getNumber3()} = ?`;
      fontSize = "36px";
    } else {
      equationString = `${level.getNumber1()} + ${level.getNumber2()} = ?`;
      fontSize = "46px";
    }

    this.equationText = this.add
      .text(430, 250, equationString, {
        fontSize: fontSize,
        color: "#F67800",
        fontFamily: "Arial Black"
      })
      .setOrigin(0.5);
  }

  private updateEquationWithCorrectAnswer() {
    if (!this.currentLevel) {
      console.error("Nível atual não encontrado ao atualizar equação");
      return;
    }

    let equationString: string;
    let fontSize: string;
    
    if (this.currentLevel.isThreeNumbers() && this.currentLevel.getNumber3() !== undefined) {
      equationString = `${this.currentLevel.getNumber1()} + ${this.currentLevel.getNumber2()} + ${this.currentLevel.getNumber3()} = ${this.correctAnswer}`;
      fontSize = "36px";
    } else {
      equationString = `${this.currentLevel.getNumber1()} + ${this.currentLevel.getNumber2()} = ${this.correctAnswer}`;
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
      },
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.equationText.clearTint();
        });
      },
    });
  }

  private createMultipleChoiceInterface(currentLevel: MathLevel) {
    const choices = currentLevel.getChoices();
    if (!choices) return;

    const buttonPositions = [
      { x: 200, y: 480 },
      { x: 400, y: 480 },
      { x: 600, y: 480 },
    ];

    this.choiceButtons = [];

    choices.forEach((choice, index) => {
      const button = new Button(
        this,
        buttonPositions[index].x,
        buttonPositions[index].y,
        "defaultButton",
        "hoverButton",
        "clickedButton",
        choice.toString(),
        62,
      );

      button.setScale(1.3);
      this.add.existing(button);
      this.choiceButtons.push(button);

      button.on("pointerdown", () => {
        if (this.isTransitioning) return;
        this.handleMultipleChoiceAnswer(choice, button);
      });
    });
  }

  private createInputInterface() {
    if (this.answerText) {
      this.answerText.destroy();
    }
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
      padding: { x: 10, y: 10 }
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

    this.submitButton = new SubmitButton(this, 550, 500, () => {
      this.handleAnswer();
    });

    this.setupKeyboardInput();
  }

  private setupKeyboardInput() {
    if (this.keyboardHandler) {
      this.input.keyboard?.off("keydown", this.keyboardHandler);
    }

    this.keyboardHandler = (event: KeyboardEvent) => {
      if (this.isTransitioning) return;
      
      if (event.key >= "0" && event.key <= "9") {
        if (this.inputText.length < 2) {
          this.inputText += event.key;
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

  handleMultipleChoiceAnswer(selectedAnswer: number, clickedButton: Button) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const currentIndex = this.logic.getCurrentLevelIndex();
    const result = this.logic.checkAnswer(selectedAnswer);

    this.choiceButtons.forEach(button => button.disableInteractive());

    if (result.correct) {
      this.audioManager.playCorrect();
      this.animationManager.correctAnswerEffect(clickedButton);
      this.animationManager.starExplosionEffect(
        clickedButton.x,
        clickedButton.y,
      );

      this.updateEquationWithCorrectAnswer();
      this.proceedToNextLevel(currentIndex);
    } else {
      this.audioManager.playIncorrect();
      this.animationManager.incorrectAnswerEffect(clickedButton);
      
      this.time.delayedCall(2000, () => {
        this.isTransitioning = false;
        this.choiceButtons.forEach(button => {
          if (button && button.scene) {
            button.setInteractive();
          }
        });
      });
    }
  }

  handleAnswer() {
    if (this.isTransitioning) return;
    
    const userAnswer = parseInt(this.inputText);
    
    if (isNaN(userAnswer)) {
      return;
    }
    
    this.isTransitioning = true;
    const currentIndex = this.logic.getCurrentLevelIndex();
    const result = this.logic.checkAnswer(userAnswer);

    if (this.submitButton) {
      this.submitButton.disableInteractive();
    }

    if (result.correct) {
      this.audioManager.playCorrect2();
      this.animationManager.correctAnswerEffect(this.answerText!);
      this.createMultipleStars(this.answerText!.x, this.answerText!.y);

      this.updateEquationWithCorrectAnswer();
      this.proceedToNextLevel(currentIndex);
    } else {
      this.audioManager.playIncorrect();
      this.animationManager.incorrectAnswerEffect(this.answerText!);

      this.time.delayedCall(2000, () => {
        this.isTransitioning = false;
        this.resetInput();
        if (this.submitButton && this.submitButton.scene) {
          this.submitButton.setInteractive();
        }
      });
    }
  }

  private createMultipleStars(centerX: number, centerY: number) {
    const starPositions = [
      { x: centerX, y: centerY - 100 },
      { x: centerX - 80, y: centerY - 60 },
      { x: centerX + 80, y: centerY - 60 },
      { x: centerX - 100, y: centerY },
      { x: centerX + 100, y: centerY },
      { x: centerX - 60, y: centerY + 60 },
      { x: centerX + 60, y: centerY + 60 },
    ];

    starPositions.forEach((pos, index) => {
      this.time.delayedCall(index * 100, () => {
        this.animationManager.starExplosionEffect(pos.x, pos.y);
      });
    });
  }

  private proceedToNextLevel(levelIndexBeforeIncrement: number) {
    this.isTransitioning = true;
    this.time.delayedCall(3000, () => {
      const nextLevelIndex = levelIndexBeforeIncrement + 1;
      
      if (nextLevelIndex === 5) {
        this.registry.set('sumCurrentLevel', nextLevelIndex);
        this.scene.start('LevelCompleteScene', {
          currentLevel: nextLevelIndex,
          completionMessage: 'Ótimo! Agora vamos\ndigitar as respostas!'
        });
      } else if (nextLevelIndex === 10) {
        this.registry.set('sumCurrentLevel', nextLevelIndex);
        this.scene.start('LevelCompleteScene', {
          currentLevel: nextLevelIndex,
          completionMessage: 'Perfeito! Agora vamos\nsomar 3 números!'
        });
      } else if (nextLevelIndex >= 15) {
        this.registry.remove('sumCurrentLevel');
        this.registry.remove('sumUserId');
        this.registry.remove('sumActivityId');
        this.scene.start('EndScene');
      } else {
        this.registry.set('sumCurrentLevel', nextLevelIndex);
        this.startLevel();
      }
    });
  }

  private resetInput() {
    this.inputText = "";
    if (this.answerText && this.answerText.scene) {
      this.answerText.setText("");
    }
    if (this.cursor && this.answerText) {
      this.updateCursorPosition();
    }
  }

  private clearScene() {
    if (this.numberDisplay) {
      this.numberDisplay.clear();
    }
    
    this.clearChoiceButtons();
    this.resetInput();

    if (this.equationText) {
      this.equationText.destroy();
    }

    if (this.answerText) {
      this.answerText.destroy();
      this.answerText = undefined;
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
  }

  private clearChoiceButtons() {
    this.choiceButtons.forEach((button) => button.destroy());
    this.choiceButtons = [];

    if (this.submitButton) {
      this.submitButton.destroy();
      this.submitButton = undefined;
    }
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
