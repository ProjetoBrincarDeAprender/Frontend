import Level from "@/games/common/models/Level";

export type MemoryCard = {
  value: string;
  textColor?: string;
  useRandomColor?: boolean;
} & (
  | {
      useFullRandom: true;
      type?: "image" | "text";
      content?: string;
    }
  | {
      useFullRandom?: false;
      type: "image" | "text";
      content: string;
    }
);

export class MemoryGameLevel extends Level {
  private _cards: MemoryCard[];
  private questionId: number;
  public get cards(): MemoryCard[] {
    return this._cards;
  }
  public get cardsValues(): string[] {
    return this.cards.map((card) => card.value);
  }
  public get cardsImages(): string[] {
    return this.cards.map((card) =>
      card.type === "image" ? card.content || "" : "",
    );
  }

  private _cardsQuantity: number;
  public get cardsQuantity(): number {
    return this._cardsQuantity;
  }

  constructor(
    name: string,
    cardPairs: MemoryCard[],
    questionId: number,
    correctAnswer?: string,
  ) {
    super(name, correctAnswer || "pass");
    this._cardsQuantity = cardPairs.length * 2;
    this.questionId = questionId;

    this._cards = cardPairs.flatMap((card) => [card, { ...card }]);
  }

  static createFromImages(
    name: string,
    cardsQuantity: number,
    cardImages: string[],
    questionId: number,
    correctAnswer?: string,
  ): MemoryGameLevel {
    const cardPairs: MemoryCard[] = Array.from(
      { length: cardsQuantity / 2 },
      (_, i) => ({
        value: String.fromCharCode(65 + i),
        type: "image" as const,
        content: cardImages[i] || "",
      }),
    );

    return new MemoryGameLevel(name, cardPairs, questionId, correctAnswer);
  }

  static createRandomLevel(
    name: string,
    pairsCount: number,
    availableImages: string[] = [
      "card-0",
      "card-1",
      "card-2",
      "card-3",
      "card-4",
    ],
    availableTexts: string[] = [
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
    ],
    questionId: number,
    correctAnswer?: string,
  ): MemoryGameLevel {
    const cardPairs: MemoryCard[] = [];

    for (let i = 0; i < pairsCount; i++) {
      const isText = Math.random() < 0.5;

      if (isText) {
        const randomText =
          availableTexts[Math.floor(Math.random() * availableTexts.length)];
        cardPairs.push({
          value: `random-text-${i}`,
          type: "text",
          content: randomText,
          useRandomColor: true,
        });
      } else {
        const randomImage =
          availableImages[Math.floor(Math.random() * availableImages.length)];
        cardPairs.push({
          value: `random-image-${i}`,
          type: "image",
          content: randomImage,
        });
      }
    }

    return new MemoryGameLevel(name, cardPairs, questionId, correctAnswer);
  }

  getQuestionId(): number {
    return this.questionId;
  }
}
