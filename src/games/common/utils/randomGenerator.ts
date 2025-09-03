export default class randomGenerator {
  static randomIndex(arrayLength: number) {
    let index: number;
    index = Math.floor(Math.random() * arrayLength);
    return index;
  }
}
