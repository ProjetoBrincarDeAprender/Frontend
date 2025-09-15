export default class RandomGenerator {
  static randomIndex(multiplier: number = 1) {
    return Math.floor(Math.random() * multiplier);
  }

  static randomCharacter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetLength = alphabet.length;
    const character = alphabet[this.randomIndex(alphabetLength)];
    return character;
  }
}
