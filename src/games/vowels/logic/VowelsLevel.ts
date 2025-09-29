import Level from "@/games/common/models/Level";

export default class VowelsLevel extends Level {
  private completeAnimalKey: string;

  constructor(animalKey: string, completeAnimalKey: string, answer: string) {
    super(animalKey, answer);
    this.completeAnimalKey = completeAnimalKey;
  }

  getCompleteAnimalKey() {
    return this.completeAnimalKey;
  }
}
