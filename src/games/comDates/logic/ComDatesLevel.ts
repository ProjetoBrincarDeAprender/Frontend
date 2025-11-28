import Level from "@/games/common/models/Level";

export default class ComDatesLevel extends Level {
  private question: string;
  private options: string[];
  private optionsImages: string[] | null;
  private difficulty: string;

  constructor(
    question: string,
    options: string[],
    optionsImages: string[] | null,
    answer: string,
    difficulty: string,
  ) {
    super(question, answer); // Chama o construtor da classe pai
    this.question = question;
    this.options = options;
    this.optionsImages = optionsImages;
    this.difficulty = difficulty;
  }

  getQuestion(): string {
    return this.question;
  }

  getOptions(): string[] {
    return this.options;
  }

  getOptionsImages(): string[] | null {
    return this.optionsImages;
  }

  getDifficulty(): string {
    return this.difficulty;
  }

  hasImages(): boolean {
    return this.optionsImages !== null;
  }

  isCorrectAnswer(selectedOption: string): boolean {
    return selectedOption === this.getAnswer();
  }

  // Sobrescreve o método da classe pai para compatibilidade
  isCorrectLetter(letter: string): boolean {
    return this.isCorrectAnswer(letter);
  }
}
