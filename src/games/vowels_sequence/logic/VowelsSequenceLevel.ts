import Level from "@/games/common/models/Level";

export default class VowelsSequenceLevel extends Level {
  private question: string[];

  constructor(levelName: string, question: string[], answer: string) {
    super(levelName, answer);
    this.question = question;
  }

  getQuestion() {
    return this.question;
  }
}
