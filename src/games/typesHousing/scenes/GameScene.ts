import { AudioManager } from "@/games/common/managers/AudioManager";
import EffectManager from "@/games/common/managers/EffectManager";
import { EndScene } from "@/games/common/scenes/EndScene";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";
import { AnimationManager } from "@/games/sum/components/animations/AnimationManager";
import Phaser from "phaser";
import { HousingGameService } from "../services/HousingGameService";

interface HousingQuestion {
  correctHousing: string;
  options: string[];
  housingName: string;
}

interface HousingIntroLevel {
  housingType: string;
  housingName: string;
  description: string;
}

export class GameScene extends PreloadScene {
  private animationsManager!: AnimationManager;
  private effectManager!: EffectManager;
  private housingGameService!: HousingGameService;
  private currentLevel: number = 0;
  private score: number = 0;
  // private background!: Phaser.GameObjects.Image;
  private questionText!: Phaser.GameObjects.Text;
  private housingNameText!: Phaser.GameObjects.Text;
  private optionContainers: Phaser.GameObjects.Container[] = [];
  private nextButton!: Phaser.GameObjects.Container;
  private dudaImage!: Phaser.GameObjects.Image;
  private isTransitioning: boolean = false;

  // Níveis introdutórios (0-6) - apenas explicação
  private housingIntroLevels: HousingIntroLevel[] = [
    {
      housingType: "duda",
      housingName: "Bem-vindos!",
      description:
        "Vamos aprender sobre os tipos de moradias. Elas são muito importantes, Vamos lá!",
    },
    {
      housingType: "casa",
      housingName: "Casa",
      description: "Esta se chama CASA!\nUm lugar onde as pessoas moram.",
    },
    {
      housingType: "castelo",
      housingName: "Castelo",
      description: "Este se chama CASTELO!\nUma moradia muito especial!",
    },
    {
      housingType: "oca",
      housingName: "Oca",
      description: "Esta se chama OCA!\nUma moradia indígena tradicional.",
    },
    {
      housingType: "iglu",
      housingName: "Iglu",
      description: "Este se chama IGLU!\nUma moradia feita de gelo.",
    },
    {
      housingType: "predio",
      housingName: "Prédio",
      description: "Este se chama PRÉDIO!\nUm local com muitas moradias.",
    },
    {
      housingType: "fim",
      housingName: "Bem-vindos!",
      description: "Vamos ver se você aprendeu tudo,\nvamos jogar!",
    },
  ];

  // Níveis de pergunta (5-9)
  private housingQuestions: HousingQuestion[] = [
    {
      correctHousing: "casa",
      options: ["casa", "castelo", "oca"],
      housingName: "Casa",
    },
    {
      correctHousing: "castelo",
      options: ["casa", "castelo", "iglu"],
      housingName: "Castelo",
    },
    {
      correctHousing: "oca",
      options: ["oca", "casa", "predio"],
      housingName: "Oca",
    },
    {
      correctHousing: "iglu",
      options: ["casa", "iglu", "castelo"],
      housingName: "Iglu",
    },
    {
      correctHousing: "predio",
      options: ["predio", "casa", "oca"],
      housingName: "Prédio",
    },
  ];

  constructor() {
    super({ key: "GameScene" });
  }

  init(data?: { currentLevel?: number; score?: number }) {
    // Recuperar dados do registry ou usar dados passados ou padrões
    this.currentLevel =
      data?.currentLevel || this.registry.get("housingCurrentLevel") || 0;
    this.score = data?.score || this.registry.get("housingScore") || 0;
    new AudioManager(this);
  }

  preload() {
    super.preload();
    this.load.image("housingBackground", "/assets/housingGame/bg.svg");
    this.load.image("background", "/assets/housingGame/bg.svg");
    this.load.image("duda-thinking", "/assets/housingGame/duda-pensando.png");
    this.load.image("housingDuda", "/assets/housingGame/duda-pensando.png");
    this.load.image("houseTrophy", "/assets/housingGame/casa.png");
    this.load.image("duda", "/assets/housingGame/girlmainpage.svg");

    this.load.image("casa", "/assets/housingGame/casa.png");
    this.load.image("castelo", "/assets/housingGame/castelo.png");
    this.load.image("oca", "/assets/housingGame/oca.png");
    this.load.image("iglu", "/assets/housingGame/iglu.png");
    this.load.image("predio", "/assets/housingGame/predio.png");

    this.load.audio("correct-sound", "/assets/common/sounds/correct.mp3");
    this.load.audio("wrong-sound", "/assets/common/sounds/incorrect.mp3");
    this.load.audio("celebration", "/assets/common/sounds/complete.mp3");
    this.load.audio("inicio", "/assets/housingGame/sounds/inicio.mp3");
    this.load.audio("fim", "/assets/housingGame/sounds/fim.mp3");

    this.load.audio("casa-sound", "/assets/housingGame/sounds/casa.mp3");
    this.load.audio("castelo-sound", "/assets/housingGame/sounds/castelo.mp3");
    this.load.audio("oca-sound", "/assets/housingGame/sounds/oca.mp3");
    this.load.audio("iglu-sound", "/assets/housingGame/sounds/IGLU.mp3");
    this.load.audio("predio-sound", "/assets/housingGame/sounds/predio.mp3");
  }

  create() {
    this.animationsManager = new AnimationManager(this);
    this.effectManager = new EffectManager(this);
    this.housingGameService = new HousingGameService();

    this.registerStandardScenes();
    this.setupBackground();
    this.setupUI();
    this.startLevel();
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("EndScene")) {
      // EndScene personalizada para Housing
      const housingEndScene = new EndScene({
        restartScene: "StartScene",
        backgroundPath: "/assets/housingGame/bg.svg",
        backgroundKey: "housingBackground",
        subtitleMessage: "VOCÊ APRENDEU SOBRE \nAS MORADIAS!",
      });

      // Registrar a cena EndScene
      this.scene.add("EndScene", housingEndScene);
    }
  }

  private setupBackground() {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xaac2ff,
    );
  }

  private setupUI() {
    const { width } = this.cameras.main;

    this.questionText = this.add
      .text(width / 2, 100, "", {
        fontSize: "42px",
        color: "#2D5AA0",
        fontFamily: "Arial Black",
        align: "center",
      })
      .setOrigin(0.5);

    this.housingNameText = this.add
      .text(width / 2, 200, "", {
        fontSize: "48px",
        color: "#ff4500",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
  }

  private createOptionContainers() {
    const { width, height } = this.cameras.main;
    const containerColors = [0x8b00ff, 0x0066ff, 0x00cc66];
    const startX = width / 2 - 250;
    const containerWidth = 200;
    const containerHeight = 200;
    const spacing = 250;

    for (let i = 0; i < 3; i++) {
      const x = startX + i * spacing;
      const y = height / 2 + 100;

      const container = this.add.container(x, y);

      const rect = this.add.rectangle(
        0,
        0,
        containerWidth,
        containerHeight,
        containerColors[i],
      );
      rect.setStrokeStyle(4, 0xffffff);
      container.add(rect);
      container.setSize(containerWidth, containerHeight);

      const hitArea = new Phaser.Geom.Rectangle(
        -containerWidth / 12,
        -containerHeight / 10,
        containerWidth,
        containerHeight,
      );
      container.setInteractive({
        hitArea,
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true,
      });
      container.setData("hitArea", hitArea);

      this.optionContainers.push(container);
    }
  }

  private startLevel() {
    const totalIntroLevels = this.housingIntroLevels.length;
    const totalQuestionLevels = this.housingQuestions.length;
    const totalLevels = totalIntroLevels + totalQuestionLevels;

    if (this.currentLevel >= totalLevels) {
      // Jogo finalizado - limpar registry e ir para EndScene
      this.registry.remove("housingCurrentLevel");
      this.registry.remove("housingScore");
      this.scene.start("EndScene");
      return;
    }
    
    this.isTransitioning = false;
    
    this.optionContainers.forEach((container) => {
      if (container && container.scene) {
        container.removeAllListeners();
        container.destroy();
      }
    });
    this.optionContainers = [];

    if (this.nextButton && this.nextButton.scene) {
      this.nextButton.removeAllListeners();
      this.nextButton.destroy();
    }

    if (this.currentLevel < totalIntroLevels) {
      this.startIntroLevel();
    } else {
      this.startQuestionLevel();
    }
  }

  private startIntroLevel() {
    const introLevel = this.housingIntroLevels[this.currentLevel];

    // Tocar som específico da moradia ou som de introdução
    if (introLevel.housingType === "duda") {
      this.sound.play("inicio");
    } else if (introLevel.housingType === "fim") {
      this.sound.play("fim");
    } else {
      this.sound.play(`${introLevel.housingType}-sound`);
    }

    const speechBubbleContainer = this.add.container(400, 150);

    const speechBubble = this.add.graphics();
    const bubbleWidth = 450;
    const bubbleHeight = 150;
    const cornerRadius = 20;

    // Desenhar o balão principal de fala
    speechBubble.fillStyle(0xffffff, 1);
    speechBubble.lineStyle(4, 0x2d5aa0, 1);
    speechBubble.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      cornerRadius,
    );
    speechBubble.strokeRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      cornerRadius,
    );

    // Desenhar a "cauda" do balão
    speechBubble.fillStyle(0xffffff, 1);
    speechBubble.lineStyle(4, 0x2d5aa0, 1);

    const tailPoints = [
      -bubbleWidth / 2 + 40,
      bubbleHeight / 2,
      -bubbleWidth / 2 + 20,
      bubbleHeight / 2 + 30,
      -bubbleWidth / 2 + 60,
      bubbleHeight / 2,
    ];

    speechBubble.fillTriangle(
      tailPoints[0],
      tailPoints[1],
      tailPoints[2],
      tailPoints[3],
      tailPoints[4],
      tailPoints[5],
    );
    speechBubble.strokeTriangle(
      tailPoints[0],
      tailPoints[1],
      tailPoints[2],
      tailPoints[3],
      tailPoints[4],
      tailPoints[5],
    );

    speechBubbleContainer.add(speechBubble);

    const bubbleText = this.add
      .text(0, -10, introLevel.description, {
        fontSize: "30px",
        color: "#2D5AA0",
        fontFamily: "Arial Black",
        align: "center",
        wordWrap: { width: bubbleWidth - 60 },
      })
      .setOrigin(0.5);

    speechBubbleContainer.add(bubbleText);

    this.optionContainers.push(speechBubbleContainer);

    speechBubbleContainer.setAlpha(0);
    speechBubbleContainer.setScale(0.5);

    this.tweens.add({
      targets: speechBubbleContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: "Back.easeOut",
      delay: 500,
    });

    if (introLevel.housingType !== "duda" && introLevel.housingType !== "fim") {
      const housingImage = this.add
        .image(500, 380, introLevel.housingType)
        .setScale(0.3);

      const emptyContainer = this.add.container(0, 0);
      emptyContainer.add(housingImage);
      this.optionContainers.push(emptyContainer);
    }

    this.createNextButton();
  }

  private startQuestionLevel() {
    if (this.dudaImage && this.dudaImage.scene) {
      this.dudaImage.destroy();
    }

    this.housingGameService.startQuestion();

    const questionIndex = this.currentLevel - this.housingIntroLevels.length;
    const question = this.housingQuestions[questionIndex];

    this.questionText.setText(`Clique na moradia que se chama:`);
    this.housingNameText.setText(question.housingName);

    const shuffledOptions = [...question.options].sort(
      () => Math.random() - 0.5,
    );

    this.createOptionContainers();

    shuffledOptions.forEach((housing, index) => {
      const container = this.optionContainers[index];

      const housingImage = this.add.image(0, 0, housing);
      housingImage.setDisplaySize(220, 210);
      container.add(housingImage);

      container.removeAllListeners("pointerdown");
      container.removeAllListeners("pointerover");
      container.removeAllListeners("pointerout");

      container.on("pointerover", () => {
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: "Power2.easeOut",
        });
      });

      container.on("pointerout", () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: "Power2.easeOut",
        });
      });

      container.on("pointerdown", () => {
        if (this.isTransitioning) return;
        this.selectOption(housing, question.correctHousing, container);
      });
    });

    this.animateContainersEntry();
  }

  private createNextButton() {
    // Adicionar a Duda apenas uma vez ao criar o primeiro botão
    if (this.currentLevel === 0) {
      this.dudaImage = this.add.image(130, 300, "duda").setScale(0.4);
    }

    const { width, height } = this.cameras.main;
    const buttonX = width / 2;
    const buttonY = height - 60;

    this.nextButton = this.add.container(buttonX, buttonY);

    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x28a745); // Verde
    buttonBg.fillRoundedRect(-80, -25, 160, 50, 25);
    buttonBg.lineStyle(3, 0xffffff);
    buttonBg.strokeRoundedRect(-80, -25, 160, 50, 25);

    // Texto do botão
    const buttonText = this.add
      .text(0, 0, "PRÓXIMO", {
        fontSize: "24px",
        color: "#FFFFFF",
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5);

    this.nextButton.add([buttonBg, buttonText]);
    this.nextButton.setSize(160, 50);
    this.nextButton.setInteractive({
      useHandCursor: true,
    });

    // Eventos do botão
    this.nextButton.on("pointerover", () => {
      this.tweens.add({
        targets: this.nextButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
      });
    });

    this.nextButton.on("pointerout", () => {
      this.tweens.add({
        targets: this.nextButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
      });
    });

    this.nextButton.on("pointerdown", () => {
      if (this.isTransitioning) return;
      this.goToNextLevel();
    });

    this.nextButton.setAlpha(0);
    this.tweens.add({
      targets: this.nextButton,
      alpha: 1,
      duration: 500,
      delay: 9000, //delay do botao
    });
  }

  private goToNextLevel() {
    this.isTransitioning = true;
    this.currentLevel++;

    // Apenas salvar o progresso e continuar para o próximo nível
    this.registry.set("housingCurrentLevel", this.currentLevel);
    this.startLevel();
  }

  private animateContainersEntry() {
    this.optionContainers.forEach((container, index) => {
      container.setAlpha(0);
      container.setScale(0.5);

      this.tweens.add({
        targets: container,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 500,
        delay: index * 200,
        ease: "Back.easeOut",
      });
    });
  }

  private async selectOption(
    selectedHousing: string,
    correctHousing: string,
    selectedContainer: Phaser.GameObjects.Container,
  ) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const isCorrect = selectedHousing === correctHousing;

    this.housingGameService.incrementAttempts();

    const isQuestionLevel = this.currentLevel >= this.housingIntroLevels.length;
    if (isQuestionLevel) {
      try {
        const studentId = this.housingGameService.getStudentId();
        const questionIndex =
          this.currentLevel - this.housingIntroLevels.length;
        const questionId = questionIndex + 1;

        if (isCorrect) {
          await this.housingGameService.registerCorrectAnswer(
            studentId,
            questionId,
            selectedHousing,
          );
        } else {
          await this.housingGameService.registerIncorrectAnswer(
            studentId,
            questionId,
            selectedHousing,
          );
        }
      } catch (error) {
        console.error("Erro ao registrar interação:", error);
      }
    }

    this.optionContainers.forEach((container) => {
      container.disableInteractive();
    });

    if (isCorrect) {
      this.handleCorrectAnswer(selectedContainer);
    } else {
      this.handleWrongAnswer(selectedContainer);
    }
  }

  private handleCorrectAnswer(container: Phaser.GameObjects.Container) {
    this.score += 100;

    this.effectManager.growup(container, "Cubic.out", 1.2, 500);

    this.sound.play("correct-sound");

    this.time.delayedCall(2000, () => {
      const totalIntroLevels = this.housingIntroLevels.length;
      const totalQuestionLevels = this.housingQuestions.length;
      const totalLevels = totalIntroLevels + totalQuestionLevels;

      const isLastLevel = this.currentLevel + 1 >= totalLevels;

      if (isLastLevel) {
        this.registry.remove("housingCurrentLevel");
        this.registry.remove("housingScore");
        this.scene.start("EndScene");
      } else {
        this.registry.set("housingCurrentLevel", this.currentLevel + 1);
        this.registry.set("housingScore", this.score);

        this.currentLevel++;
        this.startLevel();
      }
    });
  }

  private handleWrongAnswer(container: Phaser.GameObjects.Container) {
    this.animationsManager.incorrectAnswerEffect(container);

    this.sound.play("wrong-sound");

    this.time.delayedCall(3000, () => {
      this.isTransitioning = false;
      this.optionContainers.forEach((c) => {
        if (c && c.scene) {
          const hitArea: Phaser.Geom.Rectangle | undefined =
            c.getData("hitArea");
          if (hitArea) {
            c.setInteractive({
              hitArea,
              hitAreaCallback: Phaser.Geom.Rectangle.Contains,
              useHandCursor: true,
            });
          } else {
            c.setInteractive({
              hitArea: new Phaser.Geom.Rectangle(-200, -120, 300, 240),
              hitAreaCallback: Phaser.Geom.Rectangle.Contains,
              useHandCursor: true,
            });
          }
        }
      });
    });
  }
}
