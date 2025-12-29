import EffectManager from "@/games/common/managers/EffectManager";
import GameStats from "@/games/common/managers/GameStats";
import { APIDataService } from "@/games/common/services/APIData.service";
import type { MemoryCard } from "../utils/memoryGameLevel";
import type { GameLevel } from "./levels";
import { GameLevels } from "./levels";

export class MemoryGameLogic {
  private scene: Phaser.Scene;
  private gameLevels: GameLevel[];
  private currentLevelIndex: number = 0;
  private currentQuestionIndex: number = 0;
  private EffectManager: EffectManager;
  private gameStats: GameStats;
  private cards: Phaser.GameObjects.Container[] = [];
  private feedbackMessage: Phaser.GameObjects.Text | null = null;
  private levelStartTime: number = 0;
  private isShowingInitialCards: boolean = false;
  private gameStarted: boolean = false;
  private activityId?: number;

  private textColors = [
    "#CC0000",
    "#00CC00",
    "#0000CC",
    "#cccc00",
    "#EE00CC",
    "#00CCCC",
    "#CC7300",
    "#4400CC",
  ];

  constructor(scene: Phaser.Scene, activityId?: number) {
    this.scene = scene;
    this.gameLevels = GameLevels;
    this.currentLevelIndex = 0;
    this.currentQuestionIndex = 0;
    this.activityId = activityId;

    this.EffectManager = new EffectManager(scene);
    this.gameStats = new GameStats();
  }

  private getRandomTextColor(): string {
    return this.textColors[Math.floor(Math.random() * this.textColors.length)];
  }

  private availableImages = ["card-0", "card-1", "card-2", "card-3", "card-4"];
  private availableTexts = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "♠",
    "♥",
    "♦",
    "♣",
    "★",
    "♪",
    "♫",
    "☀",
    "☁",
    "❤",
  ];

  private processFullRandomCards(cards: MemoryCard[]) {
    const cardsByValue = new Map<string, MemoryCard[]>();

    cards.forEach((card) => {
      if (card.useFullRandom) {
        if (!cardsByValue.has(card.value)) {
          cardsByValue.set(card.value, []);
        }
        cardsByValue.get(card.value)!.push(card);
      }
    });

    // Set para rastrear combinações já utilizadas (tipo:conteúdo:cor)
    // Evita que dois pares tenham exatamente a mesma combinação
    const usedCombinations = new Set<string>();

    cardsByValue.forEach((pairCards) => {
      let isText: boolean;
      let content: string;
      let color: string | undefined;
      let combinationKey: string;
      let attempts = 0;

      // Tenta até 100 vezes encontrar uma combinação única
      do {
        isText = Math.random() < 0.5;

        if (isText) {
          content =
            this.availableTexts[
              Math.floor(Math.random() * this.availableTexts.length)
            ];
          color =
            this.textColors[Math.floor(Math.random() * this.textColors.length)];
          combinationKey = `text:${content}:${color}`;
        } else {
          content =
            this.availableImages[
              Math.floor(Math.random() * this.availableImages.length)
            ];
          color = undefined;
          combinationKey = `image:${content}`;
        }

        attempts++;
      } while (usedCombinations.has(combinationKey) && attempts < 100);

      // Adiciona a combinação ao set de usadas
      usedCombinations.add(combinationKey);

      // Aplica a configuração ao par de cartas
      pairCards.forEach((card) => {
        card.type = isText ? "text" : "image";
        card.content = content;

        if (isText) {
          card.useRandomColor = true;
          card.textColor = color;
        } else {
          delete card.useRandomColor;
          delete card.textColor;
        }
      });
    });
  }

  private randomizeCards() {
    if (this.isGameFinished()) return;
    const cards = this.getCurrentQuestion().cards;

    this.processFullRandomCards(cards);

    Phaser.Utils.Array.Shuffle(cards);

    const cardColorMap = new Map<string, string>();
    cards.forEach((card) => {
      if (
        card.type === "text" &&
        card.useRandomColor &&
        !cardColorMap.has(card.value)
      ) {
        cardColorMap.set(card.value, this.getRandomTextColor());
      }
    });

    this.cards = cards.map((card, index: number) => {
      const cardsPerRow = Math.ceil(Math.sqrt(cards.length));
      const totalRows = Math.ceil(cards.length / cardsPerRow);

      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const cardsInCurrentRow = Math.min(
        cardsPerRow,
        cards.length - row * cardsPerRow,
      );

      const cardWidth = 100;
      const cardHeight = 150;
      const horizontalSpacing = 20;
      const verticalSpacing = 30;

      const totalWidth =
        cardsInCurrentRow * cardWidth +
        (cardsInCurrentRow - 1) * horizontalSpacing;
      const totalHeight =
        totalRows * cardHeight + (totalRows - 1) * verticalSpacing;

      const startX = (this.scene.scale.width - totalWidth) / 2 + cardWidth / 2;
      const startY =
        (this.scene.scale.height - totalHeight) / 2 + cardHeight / 2;

      const x = startX + col * (cardWidth + horizontalSpacing);
      const y = startY + row * (cardHeight + verticalSpacing);
      const cardBackground = this.scene.add
        .rectangle(0, 0, 100, 150, 0xddeeff)
        .setStrokeStyle(2, 0x000000);

      let cardContent: Phaser.GameObjects.GameObject | null = null;

      if (card.type === "image" && card.content) {
        cardContent = this.scene.add
          .image(0, 0, card.content)
          .setDisplaySize(110, 110)
          .setVisible(false);
      } else if (card.type === "text") {
        let textColor = "#000000";

        if (card.useRandomColor) {
          textColor = cardColorMap.get(card.value) || this.getRandomTextColor();
        } else if (card.textColor) {
          textColor = card.textColor;
        }

        cardContent = this.scene.add
          .text(0, 0, "", {
            fontFamily: "Architects Daughter",
            fontSize: "64px",
            color: textColor,
          })
          .setOrigin(0.5, 0.5);
      }

      const cardVisual = [cardBackground, cardContent].filter(
        (el) => el !== null,
      ) as Phaser.GameObjects.GameObject[];

      const cardContainer = this.scene.add
        .container(x, y, cardVisual)
        .setSize(100, 150)
        .setInteractive();
      cardContainer.setData("value", card.value);
      cardContainer.setData("type", card.type);
      cardContainer.setData("content", card.content);
      cardContainer.setData("flipped", false);
      cardContainer.setData("matched", false);
      cardContainer.setData("animating", false);
      return cardContainer;
    });
  }

  createCards() {
    this.randomizeCards();
    this.cardLogic();
    this.showAllCardsTemporarily();
  }

  private showAllCardsTemporarily() {
    this.isShowingInitialCards = true;

    this.cards.forEach((card) => {
      card.disableInteractive();
      this.setCardDisplay(card, true);
    });

    this.scene.time.delayedCall(2000, () => {
      this.cards.forEach((card) => {
        this.flipCard(card, false, () => {
          card.setInteractive();
        });
      });

      this.scene.time.delayedCall(500, () => {
        this.isShowingInitialCards = false;
        this.gameStarted = true;
      });
    });
  }

  private cardLogic() {
    this.cards.forEach((card, _index) => {
      card.on("pointerdown", () => {
        const cardValue = card.getData("value");
        const cardFlipped = card.getData("flipped");
        const cardAnimating = card.getData("animating");

        if (cardFlipped || cardAnimating) return;

        const flippedCards = this.cards.filter(
          (c) => c.getData("flipped") && !c.getData("matched"),
        );

        if (flippedCards.length >= 2) {
          return;
        }

        this.flipCard(card, true, () => {
          const flippedCards = this.cards.filter(
            (c) => c.getData("flipped") && c !== card && !c.getData("matched"),
          );

          if (flippedCards.length === 1) {
            const firstCard = flippedCards[0];
            const firstCardValue = firstCard.getData("value");

            if (firstCardValue === cardValue) {
              this.scene.sound.play("correct", { volume: 0.7 });
              this.EffectManager.particles("star");
              this.showSuccessMessage();
              firstCard.setData("matched", true);
              card.setData("matched", true);
              this.cards.forEach((c) => c.disableInteractive());
              this.scene.time.delayedCall(2200, () => {
                this.cards.forEach((c) => c.setInteractive());
              });
            } else {
              this.scene.sound.play("incorrect", { volume: 0.7 });
              this.gameStats.addMiss();
              this.showErrorMessage();
              this.cards.forEach((c) => c.disableInteractive());
              this.scene.time.delayedCall(3500, () => {
                this.flipCard(card, false);
                this.flipCard(firstCard, false);
                this.scene.time.delayedCall(300, () => {
                  this.cards.forEach((c) => c.setInteractive());
                });
              });
            }
          }
        });
      });
      this.scene.add.existing(card);
    });
  }

  private flipCard(
    card: Phaser.GameObjects.Container,
    reveal: boolean,
    onComplete?: () => void,
  ) {
    card.setData("animating", true);

    this.scene.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      ease: "Power2",
      onComplete: () => {
        this.setCardDisplay(card, reveal);
        this.scene.tweens.add({
          targets: card,
          scaleX: 1,
          duration: 150,
          ease: "Power2",
          onComplete: () => {
            card.setData("animating", false);
            if (onComplete) onComplete();
          },
        });
      },
    });
  }

  private setCardDisplay(card: Phaser.GameObjects.Container, visible: boolean) {
    const cardType = card.getData("type");
    const cardContent = card.getData("content");
    card.setData("flipped", visible);

    if (card.list[1]) {
      if (
        cardType === "image" &&
        card.list[1] instanceof Phaser.GameObjects.Image
      ) {
        (card.list[1] as Phaser.GameObjects.Image).setVisible(visible);
      } else if (
        cardType === "text" &&
        card.list[1] instanceof Phaser.GameObjects.Text
      ) {
        const textObj = card.list[1] as Phaser.GameObjects.Text;
        textObj.setText(visible ? cardContent : "");
      }
    }
  }

  public isQuestionCompleted() {
    if (this.isShowingInitialCards || !this.gameStarted) {
      return false;
    }
    if (this.cards.every((card) => card.getData("matched"))) {
      return true;
    }
    return false;
  }

  public getCurrentQuestion() {
    if (this.currentLevelIndex >= this.gameLevels.length) {
      return this.gameLevels[this.gameLevels.length - 1].questions[0];
    }
    const currentLevel = this.gameLevels[this.currentLevelIndex];
    if (this.currentQuestionIndex >= currentLevel.questions.length) {
      return currentLevel.questions[currentLevel.questions.length - 1];
    }
    return currentLevel.questions[this.currentQuestionIndex];
  }

  public getCurrentLevel() {
    return this.currentLevelIndex;
  }

  public getCurrentQuestionIndex() {
    return this.currentQuestionIndex;
  }

  public isQuestionFinished() {
    return (
      this.currentQuestionIndex >=
      this.gameLevels[this.currentLevelIndex].questions.length - 1
    );
  }

  public isLevelFinished() {
    return (
      this.currentQuestionIndex >=
      this.gameLevels[this.currentLevelIndex].questions.length
    );
  }

  public isGameFinished() {
    return this.currentLevelIndex >= this.gameLevels.length;
  }

  public isLastLevel() {
    return this.currentLevelIndex >= this.gameLevels.length - 1;
  }

  public finishQuestion() {
    const levelEndTime = this.scene.time.now;
    this.gameStats.addHitTime(levelEndTime);
    this.gameStats.addMissCount();
    this.gameStats.resetActualLevelMisses();

    this.currentQuestionIndex++;

    const levelData = {
      isCorrect: true,
      answer: "ok",
      timeSpent: levelEndTime - this.levelStartTime,
      attempts: this.gameStats.missCounts[0],
      neededHint: false,
    };

    const apiService = new APIDataService(this.scene);

    apiService.sendGameData(
      this.activityId || 4,
      this.getQuestionId(),
      levelData,
    );
  }

  public finishLevel() {
    this.currentLevelIndex++;
    this.currentQuestionIndex = 0;
  }

  public getAbsoluteQuestionIndex() {
    let index = 1;
    for (let i = 0; i < this.currentLevelIndex; i++) {
      index += this.gameLevels[i].questions.length;
    }
    return index + this.currentQuestionIndex;
  }

  public getQuestionId(): number {
    return this.getCurrentQuestion().getQuestionId();
  }

  public getCurrentLevelInfo() {
    if (this.currentLevelIndex >= this.gameLevels.length) {
      return {
        difficulty: "Unknown",
        questionNumber: 0,
        totalQuestions: 0,
      };
    }
    const currentLevel = this.gameLevels[this.currentLevelIndex];
    return {
      difficulty: currentLevel.difficulty,
      questionNumber: this.currentQuestionIndex + 1,
      totalQuestions: currentLevel.questions.length,
    };
  }

  public getCurrentAttempts() {
    return (
      this.gameStats.missCounts.reduce((total, misses) => total + misses, 0) +
      this.gameStats.getCurrentLevelMisses()
    );
  }

  public getCurrentLevelTime() {
    return this.scene.time.now - this.levelStartTime;
  }

  public resetGame() {
    this.currentLevelIndex = 0;
    this.currentQuestionIndex = 0;
    this.gameStats = new GameStats();
    this.levelStartTime = 0;
    this.isShowingInitialCards = false;
    this.gameStarted = false;
    if (this.feedbackMessage) {
      this.feedbackMessage.destroy();
      this.feedbackMessage = null;
    }
  }

  public initializeLevel() {
    this.levelStartTime = this.scene.time.now;
    this.gameStats.resetInitialLevelTime(this.levelStartTime);
    this.gameStarted = false;
    this.isShowingInitialCards = false;
  }

  public setCurrentLevelFromRegistry(absoluteQuestionIndex: number) {
    this.currentLevelIndex = 0;
    this.currentQuestionIndex = 0;

    let currentIndex = 0;
    for (let levelIdx = 0; levelIdx < this.gameLevels.length; levelIdx++) {
      const questionsInLevel = this.gameLevels[levelIdx].questions.length;
      if (currentIndex + questionsInLevel > absoluteQuestionIndex) {
        this.currentLevelIndex = levelIdx;
        this.currentQuestionIndex = absoluteQuestionIndex - currentIndex;
        break;
      }
      currentIndex += questionsInLevel;
    }
  }

  private showFeedbackMessage(
    message: string,
    color: string = "#ff4444",
    duration: number = 2500,
  ) {
    if (this.feedbackMessage) {
      this.feedbackMessage.destroy();
    }

    this.feedbackMessage = this.scene.add
      .text(this.scene.scale.width / 2, 100, message, {
        fontSize: "28px",
        fontFamily: "Arial Black",
        fontStyle: "bold",
        color: color,
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#00000050",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);

    this.feedbackMessage.setScale(0);
    this.scene.tweens.add({
      targets: this.feedbackMessage,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    this.scene.time.delayedCall(duration, () => {
      if (this.feedbackMessage) {
        this.scene.tweens.add({
          targets: this.feedbackMessage,
          alpha: 0,
          scale: 0.8,
          duration: 300,
          ease: "Power2.easeIn",
          onComplete: () => {
            if (this.feedbackMessage) {
              this.feedbackMessage.destroy();
              this.feedbackMessage = null;
            }
          },
        });
      }
    });
  }

  private showSuccessMessage() {
    this.showFeedbackMessage("MUITO BEM! PARABÉNS! 🎉", "#22c55e", 2000);
  }

  private showErrorMessage() {
    this.showFeedbackMessage(
      "TENTE NOVAMENTE! VOCÊ CONSEGUE! 😊",
      "#ef4444",
      2500,
    );
  }
}
