import { SyllableGameDataGenerator } from "./SyllableGameDataGenerator";

export class ComplexSyllableDataGenerator extends SyllableGameDataGenerator {
  /**
   * Retorna todas as consoantes disponíveis
   * @returns Array com todas as consoantes
   */
  static override getAvailableConsonants(): string[] {
    return [
      "BR",
      "CR",
      "DR",
      "FR",
      "GR",
      "PR",
      "TR",
      "BL",
      "CL",
      "FL",
      "GL",
      "PL",
      "VL",
    ];
  }
}
