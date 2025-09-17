import Level from "@/games/common/models/Level";

export class MemoryGameLevel extends Level {
  private _cards: { value: string; image?: string }[];
  public get cards(): { value: string; image?: string }[] {
    return this._cards;
  }
  public get cardsValues(): string[] {
    return this.cards.map((card) => card.value);
  }
  public get cardsImages(): string[] {
    return this.cards.map((card) => card.image || "");
  }

  private _cardsQuantity: number;
  public get cardsQuantity(): number {
    return this._cardsQuantity;
  }

  constructor(
    name: string,
    cardsQuantity: number,
    cardImages: string[],
    correctAnswer?: string,
  ) {
    super(name, correctAnswer || "pass");
    this._cardsQuantity = cardsQuantity;
    this._cards = Array.from({ length: cardsQuantity / 2 }, (_, i) => ({
      value: String.fromCharCode(65 + i),
      image: cardImages[i] || "",
    })).flatMap((card) => [card, { ...card }]);
  }
}
