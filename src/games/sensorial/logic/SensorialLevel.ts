import Level from "@/games/common/models/Level";

export default class SensorialLevel extends Level {
  private question: string;
  private options: string[];
  private optionsImages: string[] | null;
  private optionsAudio: string[] | null;
  private questionAudio: string | null;
  private questionImage: string | null;
  private difficulty: string;
  private levelType: "audio-to-image" | "image-to-audio";
  private questionId: number;

  constructor(
    question: string,
    options: string[],
    optionsImages: string[] | null,
    optionsAudio: string[] | null,
    questionAudio: string | null,
    questionImage: string | null,
    answer: string,
    difficulty: string,
    levelType: "audio-to-image" | "image-to-audio",
    questionId: number,
  ) {
    super(question, answer);
    this.question = question;
    this.options = options;
    this.optionsImages = optionsImages;
    this.optionsAudio = optionsAudio;
    this.questionAudio = questionAudio;
    this.questionImage = questionImage;
    this.difficulty = difficulty;
    this.levelType = levelType;
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

  getOptionsAudio(): string[] | null {
    return this.optionsAudio;
  }

  getQuestionAudio(): string | null {
    return this.questionAudio;
  }

  getQuestionImage(): string | null {
    return this.questionImage;
  }

  getDifficulty(): string {
    return this.difficulty;
  }

  getLevelType(): "audio-to-image" | "image-to-audio" {
    return this.levelType;
  }

  getQuestionId(): number {
    return this.questionId;
  }

  hasOptionsImages(): boolean {
    return this.optionsImages !== null;
  }

  hasOptionsAudio(): boolean {
    return this.optionsAudio !== null;
  }

  hasQuestionAudio(): boolean {
    return this.questionAudio !== null;
  }

  hasQuestionImage(): boolean {
    return this.questionImage !== null;
  }

  isCorrectAnswer(selectedOption: string): boolean {
    return selectedOption === this.getAnswer();
  }

  // Sobrescreve o método da classe pai para compatibilidade
  isCorrectLetter(letter: string): boolean {
    return this.isCorrectAnswer(letter);
  }
}
