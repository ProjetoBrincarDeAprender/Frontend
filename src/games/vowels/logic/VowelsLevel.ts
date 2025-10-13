import Level from "@/games/common/models/Level";

export default class VowelsLevel extends Level {
  private completeEntityKey: string;

  constructor(animalKey: string, completeEntityKey: string, answer: string) {
    super(animalKey, answer);
    this.completeEntityKey = completeEntityKey;
  }

  getCompleteEntityKey() {
    return this.completeEntityKey;
  }
}
