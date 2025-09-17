import EffectManager from "@/games/common/managers/EffectManager";
import GameStats from "@/games/common/managers/GameStats";
import LevelManager from "@/games/common/managers/LevelManager";
import { MemoryGameLevel } from "../utils/memoryGameLevel";

export class MemoryGameLogic {
  private scene: Phaser.Scene;
  private LevelManager: LevelManager<MemoryGameLevel>;
  private EffectManager: EffectManager;
  private gameStats: GameStats;
  private cards: Phaser.GameObjects.Container[] = [];

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
      const x =
        index < cards.length / 2
          ? 100 + index * 150
          : 100 + (index - cards.length / 2) * 150;
      const y =
        index < cards.length / 2
          ? this.scene.scale.height / 2 + 75
          : this.scene.scale.height / 2 - 75;
      const cardBackground = this.scene.add
        .rectangle(0, 0, 100, 150, 0x333333)
        .setStrokeStyle(2, 0xffffff);

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
      return cardContainer;
    });
  }

  createCards() {
    this.randomizeCards();
    this.cardLogic();
  }

  private cardLogic() {
    this.cards.forEach((card, _index) => {
      card.on("pointerdown", () => {
        const cardValue = card.getData("value");
        const cardFlipped = card.getData("flipped");
        if (cardFlipped) return;

        this.setCardDisplay(card, true);

        const flippedCards = this.cards.filter(
          (c) => c.getData("flipped") && c !== card && !c.getData("matched"),
        );

        if (flippedCards.length === 1) {
          const firstCard = flippedCards[0];
          const firstCardValue = firstCard.getData("value");

          console.log(
            "First Card:",
            firstCardValue,
            " - Second Card:",
            cardValue,
          );

          if (firstCardValue === cardValue) {
            this.EffectManager.particles("star");
            firstCard.setData("matched", true);
            card.setData("matched", true);
            this.cards.forEach((c) => c.disableInteractive());
            this.scene.time.delayedCall(500, () => {
              this.cards.forEach((c) => c.setInteractive());
            });
          } else {
            this.gameStats.addMiss();
            this.cards.forEach((c) => c.disableInteractive());
            this.scene.time.delayedCall(1000, () => {
              card.setData("flipped", false);
              firstCard.setData("flipped", false);
              this.setCardDisplay(card, false);
              this.setCardDisplay(firstCard, false);
              this.cards.forEach((c) => c.setInteractive());
            });
          }
        }
      });
      this.scene.add.existing(card);
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
    if (this.cards.every((card) => card.getData("flipped"))) {
      return true;
    }
    return false;
  }

  public finishLevel() {
    this.gameStats.addHitTime(this.scene.time.now);
    this.gameStats.addMissCount();
    this.gameStats.resetActualLevelMisses();
    if (this.LevelManager.nextLevel()) {
      console.log("Next Level:", this.LevelManager.getCurrentLevel().getName());
    }
  }

  public isGameFinished() {
    return this.LevelManager.isFinished();
  }
}
