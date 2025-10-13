import Phaser from "phaser";
import MathLevel, { LevelType } from "../MathLevel";
import MathLogic from "../logic/logic";
import { AudioManager } from "../audio/AudioManager";
import { AnimationManager } from "../components/animations/AnimationManager";
import { NumberDisplay } from "../components/ui/NumberDisplay";
import { SubmitButton } from "../components/buttons/SubmitButton";
import { StartButton } from "../components/buttons/StartButton";
import Button from "../../common/models/Button";

export default class MathGame extends Phaser.Scene {
  private logic!: MathLogic;
  private audioManager!: AudioManager;
  private animationManager!: AnimationManager;
  private numberDisplay!: NumberDisplay;
  private answerText!: Phaser.GameObjects.Text;
  private equationText!: Phaser.GameObjects.Text;
  private correctAnswer: number = 0;
  private currentLevel: MathLevel | null = null;
  private inputText: string = "";
  private userId: string = "default_user";
  private activityId?: number;
  private choiceButtons: Button[] = [];
  private submitButton?: SubmitButton;

  constructor() {
    super("MathGame");
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setActivityId(activityId: number) {
    this.activityId = activityId;
  }

  preload() {
    this.loadAssets();
    this.audioManager = new AudioManager(this);
    this.audioManager.preloadSounds();
  }

  private loadAssets() {
    this.load.image("backgroundStart", "/assets/sumGame/FUNDO.png");
    this.load.image("frog", "/assets/sumGame/sapita.png");
    this.load.image("sapoFala", "/assets/sumGame/sapita-fala.png");
    this.load.image("um", "/assets/sumGame/um.png");
    this.load.image("dois", "/assets/sumGame/dois.png");
    this.load.image("tres", "/assets/sumGame/tres.png");
    this.load.image("quatro", "/assets/sumGame/quatro.png");
    this.load.image("cinco", "/assets/sumGame/cinco.png");
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
  }

  create() {
    this.initializeManagers();

    if (!this.logic) {
      this.initializeLogic();
      this.createStartScene();
    } else {
      this.createLevelScene();
    }
  }

  private initializeManagers() {
    this.audioManager.createSounds();
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

    this.logic = new MathLogic(this, levels, this.userId, this.activityId);
  }

  createStartScene() {
    this.add.image(400, 300, "backgroundStart").setScale(0.8);
    this.add.image(320, 430, "frog").setScale(0.4);

    this.createTitle();
    this.createStartButton();
  }

  private createTitle() {
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x1e62a7, 1);
    titleBg.fillRoundedRect(180, 60, 448, 80, 20);

    this.add
      .text(400, 100, "AJUDE O SAPINHO A SOMAR!", {
        fontSize: "30px",
        fontFamily: "baloobhai",
        color: "#fff",
      })
      .setOrigin(0.5);
  }

  private createStartButton() {
    new StartButton(this, 400, 200, () => {
      this.scene.restart();
      this.createLevelScene();
    });
  }

  createLevelScene() {
    this.clearScene();

    this.currentLevel = this.logic.getCurrentLevel();
    if (!this.currentLevel) {
      console.error("Nível atual não encontrado");
      return;
    }

    this.inputText = "";
    this.correctAnswer = this.currentLevel.getAnswer();

    this.createLevelBackground();
    this.createEquationDisplay(this.currentLevel);
    this.numberDisplay.display([
      this.currentLevel.number1,
      this.currentLevel.number2,
    ]);

    if (this.currentLevel.isMultipleChoice()) {
      this.createMultipleChoiceInterface(this.currentLevel);
    } else {
      this.createInputInterface();
    }
  }

  private createLevelBackground() {
    this.add.image(400, 300, "backgroundStart").setScale(0.8);
    this.add.image(380, 360, "sapoFala").setScale(1.0);
  }

  private createEquationDisplay(level: MathLevel) {
    const equationString = `${level.getNumber1()} + ${level.getNumber2()} = ?`;

    this.equationText = this.add
      .text(430, 250, equationString, {
        fontSize: "46px",
        color: "#F67800",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  private updateEquationWithCorrectAnswer() {
    if (!this.currentLevel) {
      console.error("Nível atual não encontrado ao atualizar equação");
      return;
    }

    const equationString = `${this.currentLevel.getNumber1()} + ${this.currentLevel.getNumber2()} = ${this.correctAnswer}`;

    this.tweens.add({
      targets: this.equationText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      ease: "Back.easeOut",
      yoyo: true,
      onStart: () => {
        this.equationText.setTint(0x00ff00);
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
        this.handleMultipleChoiceAnswer(choice, button);
      });
    });
  }

  private createInputInterface() {
    this.add.text(90, 490, "DIGITE A RESPOSTA: ", {
      fontSize: "24px",
      color: "#000",
      fontStyle: "bold",
      backgroundColor: "#ffffff",
    });

    this.answerText = this.add
      .text(392, 500, " ", {
        fontSize: "48px",
        color: "#000",
        backgroundColor: "#ffffff",
        padding: { x: 10, y: 10 },
      })
      .setOrigin(0.5);

    this.submitButton = new SubmitButton(this, 550, 500, () => {
      this.handleAnswer();
    });

    this.setupKeyboardInput();
  }

  private setupKeyboardInput() {
    this.input.keyboard!.on("keydown", (event: KeyboardEvent) => {
      if (event.key >= "0" && event.key <= "9") {
        this.inputText += event.key;
        this.answerText.setText(this.inputText);
      } else if (event.key === "Backspace") {
        this.inputText = this.inputText.slice(0, -1);
        this.answerText.setText(this.inputText);
      } else if (event.key === "Enter") {
        this.handleAnswer();
      }
    });
  }

  handleMultipleChoiceAnswer(selectedAnswer: number, clickedButton: Button) {
    const result = this.logic.checkAnswer(selectedAnswer);

    if (result.correct) {
      this.audioManager.playCorrect();
      this.animationManager.correctAnswerEffect(clickedButton);
      this.animationManager.starExplosionEffect(
        clickedButton.x,
        clickedButton.y,
      );

      this.updateEquationWithCorrectAnswer();

      this.proceedToNextLevel(result.finished);
    } else {
      this.audioManager.playIncorrect();
      this.animationManager.incorrectAnswerEffect(clickedButton);
    }
  }

  handleAnswer() {
    const result = this.logic.checkAnswer(parseInt(this.inputText));

    if (result.correct) {
      this.audioManager.playCorrect2();
      this.animationManager.correctAnswerEffect(this.answerText);
      this.createMultipleStars(this.answerText.x, this.answerText.y);

      this.updateEquationWithCorrectAnswer();

      this.proceedToNextLevel(result.finished);
    } else {
      this.audioManager.playIncorrect();
      this.animationManager.incorrectAnswerEffect(this.answerText);

      this.time.delayedCall(1000, () => {
        this.resetInput();
      });
    }
  }

  private createMultipleStars(centerX: number, centerY: number) {
    const starPositions = [
      { x: centerX, y: centerY - 50 },
      { x: centerX - 40, y: centerY - 30 },
      { x: centerX + 40, y: centerY - 30 },
      { x: centerX - 50, y: centerY },
      { x: centerX + 50, y: centerY },
      { x: centerX - 30, y: centerY + 30 },
      { x: centerX + 30, y: centerY + 30 },
    ];

    starPositions.forEach((pos, index) => {
      this.time.delayedCall(index * 100, () => {
        this.animationManager.starExplosionEffect(pos.x, pos.y);
      });
    });
  }

  private proceedToNextLevel(finished: boolean) {
    this.time.delayedCall(3000, () => {
      if (!finished) {
        this.audioManager.playComplete();
        this.resetInput();
        this.scene.start("SumLevelCompleteScene", { isLastLevel: false });
      } else {
        this.audioManager.playComplete();
        this.showEndScene();
      }
    });
  }

  private resetInput() {
    this.inputText = "";
    if (this.answerText) {
      this.answerText.setText(" ");
    }
  }

  private clearScene() {
    this.numberDisplay.clear();
    this.clearChoiceButtons();
    this.resetInput();

    if (this.equationText) {
      this.equationText.destroy();
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

  showEndScene() {
    this.clearScene();

    this.cameras.main.setBackgroundColor("#AED3E3");
    this.children.removeAll();

    this.createEndSceneContent();
  }

  private createEndSceneContent() {
    this.add.image(400, 300, "backgroundStart").setScale(0.8);
    this.add.image(380, 360, "sapoFala").setScale(0.9);

    this.createEndTitle();
    this.createEndMessage();
    this.createStars();
    this.createMoreGamesButton();
  }

  private createEndTitle() {
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x1e90ff, 0.8);
    titleBg.fillRoundedRect(100, 60, 600, 80, 20);

    this.add
      .text(400, 100, "PARABÉNS! VOCÊ AJUDOU O SAPINHO!", {
        fontSize: "30px",
        fontFamily: "Arial",
        color: "#fff",
      })
      .setOrigin(0.5);
  }

  private createEndMessage() {
    this.add
      .text(420, 265, "OBRIGADO!", {
        fontSize: "30px",
        color: "#000",
      })
      .setOrigin(0.5);
  }

  private createStars() {
    const starPositions = [
      { x: 200, y: 150, scale: 0.3 },
      { x: 600, y: 150, scale: 0.3 },
      { x: 150, y: 250, scale: 0.2 },
      { x: 650, y: 250, scale: 0.2 },
    ];

    starPositions.forEach((star) => {
      this.add
        .image(star.x, star.y, "star")
        .setScale(star.scale)
        .setTint(0xffd700);
    });
  }

  private createMoreGamesButton() {
    const button = new StartButton(this, 500, 450, () => {
      window.location.href = "/games";
    });

    button.setText("MAIS JOGOS");
  }
}
