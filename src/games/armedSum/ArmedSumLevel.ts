/**
 * Representa um nível do jogo de Conta Armada
 */
export class ArmedSumLevel {
  private numberA: number;
  private numberB: number;
  private digits: number;
  private answer: number;

  constructor(digits: number) {
    this.digits = digits;
    const result = this.generateValidNumbers(digits);
    this.numberA = result.numberA;
    this.numberB = result.numberB;
    this.answer = this.numberA + this.numberB;
  }

  private generateValidNumbers(digits: number): {
    numberA: number;
    numberB: number;
  } {
    const digitsA: number[] = [];
    const digitsB: number[] = [];

    for (let i = 0; i < digits; i++) {
      const digitA =
        i === digits - 1
          ? Phaser.Math.Between(1, 9) // Primeiro dígito não pode ser 0
          : Phaser.Math.Between(0, 9);

      const maxB = 9 - digitA; // Garantir que A[i] + B[i] <= 9
      const digitB = Phaser.Math.Between(0, maxB);

      digitsA.push(digitA);
      digitsB.push(digitB);
    }

    // Converter arrays de dígitos em números
    const numberA = parseInt(digitsA.reverse().join(""));
    const numberB = parseInt(digitsB.reverse().join(""));

    return { numberA, numberB };
  }

  getNumberA(): number {
    return this.numberA;
  }

  getNumberB(): number {
    return this.numberB;
  }

  getAnswer(): number {
    return this.answer;
  }

  getDigits(): number {
    return this.digits;
  }
}
