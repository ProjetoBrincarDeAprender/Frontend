import Level from "@/games/common/models/Level";

export default class HygieneLevel extends Level {
  private question: string;
  private options: string[];
  private optionsImages: string[] | null;
  private difficulty: string;
  private actionImage: string | null;
  private questionId: number;

  constructor(
    question: string,
    options: string[],
    optionsImages: string[] | null,
    answer: string,
    difficulty: string,
    questionId: number,
    actionImage: string | null = null,
  ) {
    super(question, answer); // Chama o construtor da classe pai
    this.question = question;
    this.options = options;
    this.optionsImages = optionsImages;
    this.difficulty = difficulty;
    this.actionImage = actionImage;
    this.questionId = questionId;
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

  getActionImage(): string | null {
    return this.actionImage;
  }

  getQuestionId(): number {
    return this.questionId;
  }

  hasImages(): boolean {
    return this.optionsImages !== null;
  }

  hasActionImage(): boolean {
    return this.actionImage !== null;
  }

  isCorrectAnswer(selectedOption: string): boolean {
    return selectedOption === this.getAnswer();
  }

  // Sobrescreve o método da classe pai para compatibilidade
  isCorrectLetter(letter: string): boolean {
    return this.isCorrectAnswer(letter);
  }
}
