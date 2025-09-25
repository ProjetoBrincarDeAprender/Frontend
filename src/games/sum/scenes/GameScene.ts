import Phaser from "phaser";
import MathLevel, { LevelType } from "../MathLevel";
import MathLogic from "../logic/logic";
import Button from "../../common/models/Button";

export default class MathGame extends Phaser.Scene {
  private logic!: MathLogic;
  private answerText!: Phaser.GameObjects.Text;
  private inputText: string = "";
  private numberImages: Phaser.GameObjects.GameObject[] = [];
  private userId: string = "default_user";
  private activityId?: number;
  private choiceButtons: Button[] = [];
  private submitButton?: Phaser.GameObjects.Container;

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
    this.load.image("backgroundStart", "/assets/sumGame/fundo.jpg");
    this.load.image("frog", "/assets/sumGame/sapito.png");
    this.load.image("sapoFala", "/assets/sumGame/sapito-fala.png");
    this.load.image("um", "/assets/sumGame/um.png");
    this.load.image("dois", "/assets/sumGame/dois.png");
    this.load.image("tres", "/assets/sumGame/tres.png");
    this.load.image("quatro", "/assets/sumGame/quatro.png");
    this.load.image("cinco", "/assets/sumGame/cinco.png");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  create() {
    if (!this.logic) {
      const levels: MathLevel[] = [];
      
      for (let i = 0; i < 5; i++) {
        levels.push(
          new MathLevel(
            Phaser.Math.Between(1, 3), 
            Phaser.Math.Between(1, 5),
            LevelType.MULTIPLE_CHOICE
          )
        );
      }
      
      for (let i = 0; i < 5; i++) {
        levels.push(
          new MathLevel(
            Phaser.Math.Between(1, 5), 
            Phaser.Math.Between(1, 5),
            LevelType.INPUT
          )
        );
      }
      
      this.logic = new MathLogic(this, levels, this.userId, this.activityId);
      this.createStartScene();
    } else {
      this.createLevelScene();
    }
  }

  createStartScene() {
    this.add.image(400, 300, "backgroundStart").setScale(1.3);
    this.add.image(340, 320, "frog").setScale(0.5);
    
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x228b22, 0.8); 
    titleBg.fillRoundedRect(200, 60, 400, 80, 20); 

    const title = this.add.text(400, 100, "Ajude o sapinho a somar!", {
      fontSize: "30px",
      fontFamily: "baloobhai",
      color: "#fff",
    }).setOrigin(0.5); 
    
    title.active = true;
    
    const startButtonContainer = this.add.container(400, 500);
    
    const startButtonBg = this.add.graphics();
    startButtonBg.fillStyle(0x228b22, 1);
    startButtonBg.fillRoundedRect(-100, -30, 200, 60, 15);

    const startButton = this.add.text(0, 0, "Jogar", {
      fontSize: "32px",
      color: "#fff",
      fontFamily: "Baloobhai",
    }).setOrigin(0.5);

    const clickArea = this.add.rectangle(0, 0, 200, 60, 0x000000, 0)
      .setInteractive({ cursor: 'pointer' });

    startButtonContainer.add([startButtonBg, startButton, clickArea]);

    clickArea.on("pointerover", () => {
      startButton.setStyle({ color: "#ff0" }); 
      startButtonBg.clear();
      startButtonBg.fillStyle(0x2e8b57, 1); 
      startButtonBg.fillRoundedRect(-100, -30, 200, 60, 15);
      startButtonContainer.setScale(1.05);
    });

    clickArea.on("pointerout", () => {
      startButton.setStyle({ color: "#fff" });
      startButtonBg.clear();
      startButtonBg.fillStyle(0x228b22, 1);
      startButtonBg.fillRoundedRect(-100, -30, 200, 60, 15);
      startButtonContainer.setScale(1.0);
    });

    clickArea.on("pointerdown", () => {
      startButtonContainer.setScale(0.95);
    });

    clickArea.on("pointerup", () => {
      startButtonContainer.setScale(1.05); 
      this.scene.restart();
      this.createLevelScene();
    });
  }

  createLevelScene() {
    this.clearNumberImages();
    this.clearChoiceButtons(); 
    
    const currentLevel = this.logic.getCurrentLevel();
    if (!currentLevel) {
      console.error("Nível atual não encontrado");
      return;
    }

    this.add.image(340, 330, "backgroundStart").setScale(1.5);
    this.add.image(350, 310, "sapoFala").setScale(0.8);

    const level = this.logic.getCurrentLevel();
    if (!level) {
      console.error("Nível não encontrado");
      return;
    }

    const numbers = [currentLevel.number1, currentLevel.number2];
    this.displayNumberImages(numbers);
    this.add.text(300, 200, `${level.getNumber1()} + ${level.getNumber2()}`, {
      fontSize: "60px",
      color: "#F67800",
      fontStyle: "bold",
    });

    if (currentLevel.isMultipleChoice()) {
      this.createMultipleChoiceInterface(currentLevel);
    } else {
      this.createInputInterface();
    }
  }

  private createMultipleChoiceInterface(currentLevel: MathLevel) {
    const choices = currentLevel.getChoices();
    if (!choices) return;

    const buttonPositions = [
      { x: 200, y: 480 },
      { x: 400, y: 480 },
      { x: 600, y: 480 }
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
        48
      );

      this.add.existing(button);
      this.choiceButtons.push(button);

      button.on("pointerdown", () => {
        this.handleMultipleChoiceAnswer(choice, button);
      });
    });
  }

  private createInputInterface() {
    this.add.text(150, 480, "Resposta: ", {
      fontSize: "38px",
      color: "#000",
      fontStyle: "bold",
    });

    this.answerText = this.add.text(392, 500, " ", {
      fontSize: "48px",
      color: "#000",
      backgroundColor: "#ffffff",
      padding: { x: 10, y: 10 },
    }).setOrigin(0.5);
    this.submitButton = this.createCustomSubmitButton(550, 500);

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

  private createCustomSubmitButton(x: number, y: number): Phaser.GameObjects.Container {
    const buttonContainer = this.add.container(x, y);
    
    const buttonBackground = this.add.graphics();
    const buttonWidth = 120;
    const buttonHeight = 50;
    const cornerRadius = 8;
    
    const defaultColor = 0x228b22; 
    const hoverColor = 0x2e8b57;  
    
    buttonBackground.fillStyle(defaultColor);
    buttonBackground.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
    
    const buttonText = this.add.text(0, 0, "Enviar", {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);
    
    buttonContainer.add(buttonBackground);
    buttonContainer.add(buttonText);
    
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();
    
    buttonContainer.on('pointerover', () => {
      buttonBackground.clear();
      buttonBackground.fillStyle(hoverColor);
      buttonBackground.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
      
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Power2'
      });
    });
    
    buttonContainer.on('pointerout', () => {
      buttonBackground.clear();
      buttonBackground.fillStyle(defaultColor);
      buttonBackground.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
      
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
    });
    
    buttonContainer.on('pointerdown', () => {
      this.tweens.add({
        targets: buttonContainer,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        ease: 'Power2',
        yoyo: true
      });
    });
    
    buttonContainer.on('pointerup', () => {
      this.handleAnswer();
    });
    
    return buttonContainer;
  }

  private clearChoiceButtons() {
    this.choiceButtons.forEach(button => button.destroy());
    this.choiceButtons = [];
    
    if (this.submitButton) {
      this.submitButton.destroy();
      this.submitButton = undefined;
    }
  }

  private clearNumberImages() {
    this.numberImages.forEach(obj => obj.destroy());
    this.numberImages = [];
  }

  private displayNumberImages(numbers: number[]) {
    const imageKeys = this.getImageKeysFromNumbers(numbers);
    
    const startX = 320;
    const startY = 110;
    const spacing = 200;

    this.createThoughtBubble(startX, startY, spacing, numbers.length);

    imageKeys.forEach((imageKey, index) => {
      if (imageKey) {
        const image = this.add.image(
          startX + (index * spacing), 
          startY, 
          imageKey
        );
        
        image.setScale(0.5);
        image.setDepth(11); 
        this.numberImages.push(image);
      }
    });
    
    if (numbers.length === 2) {
      const plusText = this.add.text(
        startX + spacing - 120, 
        startY - 10, 
        '+', 
        { 
          fontSize: '48px', 
          color: '#000000',
          fontStyle: 'bold'
        }
      );
      plusText.setDepth(11);
      this.numberImages.push(plusText);
    }
  }

  private createThoughtBubble(centerX: number, centerY: number, spacing: number, numberCount: number) {
    const bubbleWidth = (numberCount === 1) ? 120 : spacing + 200;
    const bubbleHeight = 130;
    const bubbleX = (numberCount === 1) ? centerX : centerX + (spacing / 2) - 10;
    
    const bubble = this.add.graphics();
    bubble.fillStyle(0xffffff, 0.95); 
    bubble.lineStyle(3, 0x000000, 1);
    
    bubble.fillRoundedRect(
      bubbleX - bubbleWidth/2, 
      centerY - bubbleHeight/2, 
      bubbleWidth, 
      bubbleHeight, 
      20
    );
    bubble.strokeRoundedRect(
      bubbleX - bubbleWidth/2, 
      centerY - bubbleHeight/2, 
      bubbleWidth, 
      bubbleHeight, 
      20
    );
    
    const thoughtCircles = [
      { x: bubbleX - 120, y: centerY + 70, radius: 8 },
      { x: bubbleX - 135, y: centerY + 80, radius: 6 },
      { x: bubbleX - 145, y: centerY + 95, radius: 4 }
    ];
    
    thoughtCircles.forEach(circle => {
      bubble.fillCircle(circle.x, circle.y, circle.radius);
      bubble.strokeCircle(circle.x, circle.y, circle.radius);
    });
    
    bubble.setDepth(10); 
    this.numberImages.push(bubble);
  }

  private getImageKeysFromNumbers(numbers: number[]): (string | null)[] {
    const numberToImageKey: { [key: number]: string } = {
      1: 'um',
      2: 'dois',
      3: 'tres',
      4: 'quatro',
      5: 'cinco',
    };
    
    return numbers.map(num => numberToImageKey[num] || null);
  }

  handleMultipleChoiceAnswer(selectedAnswer: number, clickedButton: Button) {
    const result = this.logic.checkAnswer(selectedAnswer);
    
    console.log(`Resposta ${selectedAnswer}: ${result.correct ? 'CORRETA' : 'INCORRETA'}`);
    
    if (result.correct) {
      this.showButtonEffect(clickedButton, true);
      
      const levelStats = this.logic.getCurrentLevelStats();
      console.log('Estatísticas do nível atual:', levelStats);
      
      this.time.delayedCall(1500, () => {
        if (!result.finished) {
          this.scene.start("SumLevelCompleteScene", { 
            isLastLevel: false 
          });
          this.clearNumberImages();
          this.clearChoiceButtons();
        } else {
          const gameStats = this.logic.getGameStats();
          console.log('Estatísticas finais do jogo:', gameStats);
          
          this.showEndScene();
          this.clearNumberImages();
          this.clearChoiceButtons();
        }
      });
    } else {
      this.showButtonEffect(clickedButton, false);
    }
  }

  private showButtonEffect(button: Button, isCorrect: boolean) {
    if (isCorrect) {
      button.getButtonText().setTint(0x00ff00);
      
      const star = this.add.image(button.x, button.y - 50, "star");
      star.setScale(0.8);
      this.tweens.add({
        targets: star,
        y: button.y - 100,
        alpha: 0,
        duration: 1000,
        onComplete: () => star.destroy()
      });
    } else {
      button.getButtonText().setTint(0xff0000);
      
      this.tweens.add({
        targets: button,
        x: button.x - 10,
        duration: 50,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.time.delayedCall(500, () => {
            button.getButtonText().clearTint();
          });
        }
      });
    }
  }

  handleAnswer() {
    const result = this.logic.checkAnswer(parseInt(this.inputText));
    
    console.log(`Resposta ${this.inputText}: ${result.correct ? 'CORRETA' : 'INCORRETA'}`);
    
    if (result.correct) {
      this.logic.successEffect(this.answerText);
      
      const levelStats = this.logic.getCurrentLevelStats();
      console.log('Estatísticas do nível atual:', levelStats);
      
      this.time.delayedCall(1500, () => {
        if (!result.finished) {
          this.scene.start("SumLevelCompleteScene", { 
            isLastLevel: false 
          });
          this.inputText = "";
          this.answerText.setText(" ");
          this.clearNumberImages();
        } else {          
          this.showEndScene();
          this.clearNumberImages();
        }
      });
    } else {
      this.logic.failEffect(this.answerText);
      this.inputText = "";
      this.answerText.setText(" ");
    }
  }

  showEndScene() {
    this.clearNumberImages();
    
    this.cameras.main.setBackgroundColor("#AED3E3");
    this.children.removeAll();
    this.add.image(340, 330, "backgroundStart").setScale(1.5);
    this.add.image(350, 310, "sapoFala").setScale(0.7);

    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x228b22, 0.8); 
    titleBg.fillRoundedRect(100, 60, 600, 80, 20); 

    const title = this.add.text(400, 100, "Parabéns! Você ajudou o sapinho!", {
      fontSize: "30px",
      fontFamily: "Arial",
      color: "#fff",
    }).setOrigin(0.5);
    
    title.active = true;

    this.add.text(400, 235, "Obrigado!", {
      fontSize: "30px",
      color: "#000",
    }).setOrigin(0.5);

    this.add.image(200, 150, "star").setScale(0.3).setTint(0xFFD700);
    this.add.image(600, 150, "star").setScale(0.3).setTint(0xFFD700);
    this.add.image(150, 250, "star").setScale(0.2).setTint(0xFFD700);
    this.add.image(650, 250, "star").setScale(0.2).setTint(0xFFD700);

    const backButtonContainer = this.add.container(400, 450);
    
    const backButtonBg = this.add.graphics();
    backButtonBg.fillStyle(0x228b22, 1); 
    backButtonBg.lineStyle(4, 0xFFFFFF, 1);
    backButtonBg.fillRoundedRect(-120, -35, 240, 70, 20);
    backButtonBg.strokeRoundedRect(-120, -35, 240, 70, 20);

    const backButtonText = this.add.text(0, 0, "🎮 Mais Jogos", {
      fontSize: "28px",
      color: "#fff",
      fontFamily: "Baloobhai",
    }).setOrigin(0.5);

    const backClickArea = this.add.rectangle(0, 0, 240, 70, 0x000000, 0)
      .setInteractive({ cursor: 'pointer' });

    backButtonContainer.add([backButtonBg, backButtonText, backClickArea]);

    backClickArea.on("pointerover", () => {
      backButtonText.setStyle({ color: "#FFD700" });
      backButtonBg.clear();
      backButtonBg.fillStyle(0x228b22, 1); 
      backButtonBg.lineStyle(4, 0xFFD700, 1);
      backButtonBg.fillRoundedRect(-120, -35, 240, 70, 20);
      backButtonBg.strokeRoundedRect(-120, -35, 240, 70, 20);
      backButtonContainer.setScale(1.1);
      
      this.tweens.add({
        targets: backButtonContainer,
        angle: { from: -2, to: 2 },
        duration: 200,
        yoyo: true,
        repeat: -1
      });
    });

    backClickArea.on("pointerout", () => {
      backButtonText.setStyle({ color: "#fff" });
      backButtonBg.clear();
      backButtonBg.fillStyle(0x228b22, 1);
      backButtonBg.lineStyle(4, 0xFFFFFF, 1);
      backButtonBg.fillRoundedRect(-120, -35, 240, 70, 20);
      backButtonBg.strokeRoundedRect(-120, -35, 240, 70, 20);
      backButtonContainer.setScale(1.0);
      
      this.tweens.killTweensOf(backButtonContainer);
      backButtonContainer.setAngle(0);
    });

    backClickArea.on("pointerdown", () => {
      backButtonContainer.setScale(0.95);
    });

    backClickArea.on("pointerup", () => {
      backButtonContainer.setScale(1.1);
      
      this.tweens.add({
        targets: backButtonContainer,
        scaleX: 0,
        scaleY: 0,
        angle: 360,
        duration: 500,
        ease: 'Back.easeIn',
        onComplete: () => {
          window.location.href = '/games';
        }
      });
    });
  }
}
