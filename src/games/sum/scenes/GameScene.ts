import Phaser from "phaser";
import MathLevel from "../MathLevel";
import MathLogic from "../logic/logic";

export default class MathGame extends Phaser.Scene {
  private logic!: MathLogic;
  private answerText!: Phaser.GameObjects.Text;
  private inputText: string = "";
  private numberImages: Phaser.GameObjects.GameObject[] = [];
  private userId: string = "default_user";
  private activityId?: number;

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
    this.load.image("star", "/assets/common/star.svg");
  }

  create() {
    if (!this.logic) {
      const levels: MathLevel[] = [];
      for (let i = 0; i < 5; i++) {
        levels.push(
          new MathLevel(Phaser.Math.Between(1, 3), Phaser.Math.Between(1, 3))
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
    const startButtonBg = this.add.graphics();
    startButtonBg.fillStyle(0x228b22, 1);
    startButtonBg.fillRoundedRect(300, 470, 200, 60, 15);

    const startButton = this.add.text(400, 500, "Jogar", {
      fontSize: "32px",
      color: "#fff",
      fontFamily: "Baloobhai",
    }).setOrigin(0.5).setInteractive();

    startButton.on("pointerover", () => {
      startButton.setStyle({ color: "#ff0" }); 
      startButtonBg.clear();
      startButtonBg.fillStyle(0x2e8b57, 1); 
      startButtonBg.fillRoundedRect(300, 470, 200, 60, 15);
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ color: "#fff" });
      startButtonBg.clear();
      startButtonBg.fillStyle(0x228b22, 1);
      startButtonBg.fillRoundedRect(300, 470, 200, 60, 15);
    });

    startButton.on("pointerdown", () => {
      this.scene.restart();
      this.createLevelScene();
    });
  }

  createLevelScene() {
    this.clearNumberImages();
    
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
    };
    
    return numbers.map(num => numberToImageKey[num] || null);
  }

  handleAnswer() {
    const result = this.logic.checkAnswer(parseInt(this.inputText));
    
    if (result.correct) {
      this.logic.successEffect(this.answerText);
      
      const levelStats = this.logic.getCurrentLevelStats();
      console.log('Estatísticas do nível:', levelStats);
      
      this.time.delayedCall(1500, () => {
        if (!result.finished) {
          this.scene.restart();
          this.inputText = "";
          this.answerText.setText(" ");
          this.clearNumberImages();
        } else {
          const gameStats = this.logic.getGameStats();
          console.log('Estatísticas finais do jogo:', gameStats);
          
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

    // const gameStats = this.logic.getGameStats();
    
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

    // Estatísticas finais
    // this.add.text(400, 300, `Tempo total: ${gameStats.totalTime.toFixed(1)}s`, {
    //   fontSize: "20px",
    //   color: "#000",
    // }).setOrigin(0.5);

    // this.add.text(400, 330, `Erros totais: ${gameStats.totalWrongAnswers}`, {
    //   fontSize: "20px",
    //   color: "#000",
    // }).setOrigin(0.5);

    // this.add.text(400, 360, `Níveis completados: ${gameStats.levelsCompleted}`, {
    //   fontSize: "20px",
    //   color: "#000",
    // }).setOrigin(0.5);
  }
}
