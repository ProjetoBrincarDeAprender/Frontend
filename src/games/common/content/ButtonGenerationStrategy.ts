export default interface ButtonGenerationStrategy {
  generate(buttonQuantity: number, answer: string): string[];
}
