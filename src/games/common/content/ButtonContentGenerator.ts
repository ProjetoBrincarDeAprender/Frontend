import type ButtonGenerationStrategy from "./ButtonGenerationStrategy";

export default class ButtonContentGenerator {
  private strategy: ButtonGenerationStrategy;

  constructor(strategy: ButtonGenerationStrategy) {
    this.strategy = strategy;
  }

  generate(buttonQuantity: number, answer: string) {
    return this.strategy.generate(buttonQuantity, answer);
  }
}
