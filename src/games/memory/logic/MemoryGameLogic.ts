import EffectManager from "@/games/common/managers/EffectManager";
import GameStats from "@/games/common/managers/GameStats";
import LevelManager from "@/games/common/managers/LevelManager";
import api from "@/utils/api";
import { MemoryGameLevel } from "../utils/memoryGameLevel";

export class MemoryGameLogic {
  private scene: Phaser.Scene;
  private LevelManager: LevelManager<MemoryGameLevel>;
  private EffectManager: EffectManager;
  private gameStats: GameStats;
  private cards: Phaser.GameObjects.Container[] = [];
  private feedbackMessage: Phaser.GameObjects.Text | null = null;
  private levelStartTime: number = 0;
  private isShowingInitialCards: boolean = false;
  private gameStarted: boolean = false;

  constructor(scene: Phaser.Scene) {
    const levels: MemoryGameLevel[] = [
      new MemoryGameLevel("Easy", 4, ["card-0", "card-1"]),
      new MemoryGameLevel("Medium", 6, ["card-0", "card-1", "card-2"]),
      new MemoryGameLevel("Hard", 10, [
        "card-0",
        "card-1",
        "card-2",
        "card-3",
        "card-4",
      ]),
    ];
    this.scene = scene;

    this.LevelManager = new LevelManager(levels);
    this.EffectManager = new EffectManager(scene);
    this.gameStats = new GameStats();
  }

  private randomizeCards() {
    if (this.LevelManager.isFinished()) return;
    const cards = this.LevelManager.getCurrentLevel().cards;
    Phaser.Utils.Array.Shuffle(cards);

    this.cards = cards.map((card, index) => {
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
        .rectangle(0, 0, 100, 150, 0xffffff)
        .setStrokeStyle(2, 0x000000);

      const cardImage = card.image
        ? this.scene.add
            .image(0, 0, card.image)
            .setDisplaySize(80, 80)
            .setVisible(false)
        : null;

      const cardText = cardImage
        ? null
        : this.scene.add.text(0, 0, "", {
            fontSize: "24px",
            color: "#ffffff",
          });

      const cardVisual = [cardBackground, cardImage, cardText].filter(
        (el) => el !== null,
      ) as Phaser.GameObjects.GameObject[];

      const cardContainer = this.scene.add
        .container(x, y, cardVisual)
        .setSize(100, 150)
        .setInteractive();
      cardContainer.setData("value", card.value);
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

        this.flipCard(card, true, () => {
          const flippedCards = this.cards.filter(
            (c) => c.getData("flipped") && c !== card && !c.getData("matched"),
          );

          if (flippedCards.length === 1) {
            const firstCard = flippedCards[0];
            const firstCardValue = firstCard.getData("value");

            if (firstCardValue === cardValue) {
              // Som de acerto ao encontrar par
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
              // Som de erro ao não corresponder
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
    const cardValue = card.getData("value");
    card.setData("flipped", visible);
    if (card.list[1] instanceof Phaser.GameObjects.Image) {
      return (card.list[1] as Phaser.GameObjects.Image).setVisible(visible);
    } else if (card.list[1] instanceof Phaser.GameObjects.Text) {
      return visible
        ? (card.list[1] as Phaser.GameObjects.Text).setText(cardValue)
        : (card.list[1] as Phaser.GameObjects.Text).setText("");
    }
  }

  public isLevelFinished() {
    if (this.isShowingInitialCards || !this.gameStarted) {
      return false;
    }
    if (this.cards.every((card) => card.getData("matched"))) {
      return true;
    }
    return false;
  }

  public finishLevel() {
    const levelEndTime = this.scene.time.now;
    this.gameStats.addHitTime(levelEndTime);
    this.gameStats.addMissCount();
    this.gameStats.resetActualLevelMisses();
    this.LevelManager.nextLevel();
    try {
      const sendData = async () => {
        const levelData = {
          activityId: 1,
          questionId: this.getCurrentLevel(),
          isCorrect: true,
          answer: "ok",
          timeSpent: levelEndTime - this.levelStartTime,
          attempts: this.gameStats.missCounts[0],
          responseDate: this.scene.time.now,
        };

        const response = await api.post(
          "/adaptiveSystem/interaction/register",
          levelData,
          {},
        );

        if (response.status === 201) {
          console.log("Data sent successfully");
          console.log(response);
        }
      };

      sendData();
    } catch (error) {
      console.log(error);
    }
  }

  public isGameFinished() {
    return this.LevelManager.isFinished();
  }

  public getCurrentLevel() {
    return this.LevelManager.getCurrentIndex();
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
    this.LevelManager.reset();
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

  public setCurrentLevelFromRegistry(levelIndex: number) {
    this.LevelManager.reset();
    for (let i = 0; i < levelIndex; i++) {
      this.LevelManager.nextLevel();
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
        fontFamily: "Arial, sans-serif",
        color: color,
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        stroke: "#FFFFFF",
        strokeThickness: 2,
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
