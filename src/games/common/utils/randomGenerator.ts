export default class RandomGenerator {
  static randomIndex(multiplier: number = 1) {
    return Math.floor(Math.random() * multiplier);
  }

  static randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomCharacter(exclude: string[] = []): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetLength = alphabet.length;
    let character = alphabet[this.randomIndex(alphabetLength)];
    while (exclude.includes(character)) {
      character = alphabet[this.randomIndex(alphabetLength)];
    }
    return character;
  }
}
