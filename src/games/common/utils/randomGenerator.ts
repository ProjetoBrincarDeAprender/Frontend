export default class randomGenerator {
  static randomIndex(multiplier: number = 1) {
    let index: number;
    index = Math.floor(Math.random() * multiplier);
    return index;
  }

  static randomCharacter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetLength = alphabet.length;
    const character = alphabet[this.randomIndex(alphabetLength)];
    return character;
  }
}
