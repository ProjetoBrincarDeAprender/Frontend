/**
 * Classe responsável por gerar dinamicamente os dados do jogo de sílabas.
 * Cria níveis baseados na consoante selecionada pelo usuário.
 */
export class SyllableGameDataGenerator {
  protected static readonly VOWELS = ["A", "E", "I", "O", "U"];

  /**
   * Gera os dados completos do jogo para uma consoante específica
   * @param consonant A consoante selecionada
   * @returns Objeto com todos os dados necessários para o jogo
   */
  static generateGameData(consonant: string): any {
    const levels = this.generateLevels(consonant);
    const audios = this.generateAudioConfig(consonant);

    return {
      config: {
        background: {
          image: "/assets/simpleSyllableGame/images/backgroundMain.png",
          overlayOpacity: 0.3,
        },
      },
      textures: {
        buttons: {
          blue: {
            default: "/assets/common/buttons/squareBlueDefault.svg",
            hover: "/assets/common/buttons/squareBlueHover.svg",
            clicked: "/assets/common/buttons/squareBlueClicked.svg",
          },
          red: {
            default: "/assets/common/buttons/squareRedDefault.svg",
            hover: "/assets/common/buttons/squareRedHover.svg",
            clicked: "/assets/common/buttons/squareRedClicked.svg",
          },
          white: {
            default: "/assets/common/buttons/squareWhiteDefault.svg",
          },
        },
        entities: [],
        effects: [
          {
            key: "star",
            texture: "/assets/common/star.svg",
          },
        ],
      },
      audios: audios,
      buttonConfig: {
        fontSize: 50,
        scale: 1.5,
      },
      info: {
        activityId: 2,
      },
      levels: levels,
    };
  }

  /**
   * Gera os níveis do jogo para uma consoante específica
   * @param consonant A consoante selecionada
   * @returns Array com os níveis do jogo
   */
  protected static generateLevels(consonant: string): any[] {
    return this.VOWELS.map((vowel) => ({
      question: "COMPLETE AS SÍLABAS",
      audioKey: consonant + vowel,
      content: [consonant, " "],
      completeContent: [consonant, vowel],
      answer: vowel,
      options: this.generateOptionsForVowel(vowel),
    }));
  }

  /**
   * Gera as opções de resposta para uma vogal específica
   * @param correctVowel A vogal correta
   * @returns Array com as opções de resposta
   */
  private static generateOptionsForVowel(correctVowel: string): string[] {
    const otherVowels = this.VOWELS.filter((v) => v !== correctVowel);
    const wrongOption =
      otherVowels[Math.floor(Math.random() * otherVowels.length)];

    const options = [correctVowel, wrongOption];
    return Math.random() < 0.5 ? options : options.reverse();
  }

  /**
   * Gera a configuração de áudio para uma consoante específica
   * @param consonant A consoante selecionada
   * @returns Array com a configuração de áudios
   */
  protected static generateAudioConfig(consonant: string): any[] {
    const baseAudios = [
      {
        key: "correct",
        path: "/assets/common/sounds/correct.mp3",
      },
      {
        key: "incorrect",
        path: "/assets/common/sounds/incorrect.mp3",
      },
    ];

    const syllableAudios = this.VOWELS.map((vowel) => ({
      key: consonant + vowel,
      path: `/assets/simpleSyllableGame/sounds/${consonant}${vowel}.m4a`,
    }));

    return [...baseAudios, ...syllableAudios];
  }

  /**
   * Retorna todas as consoantes disponíveis
   * @returns Array com todas as consoantes
   */
  static getAvailableConsonants(): string[] {
    return [
      "B",
      "C",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
  }

  /**
   * Retorna todas as vogais disponíveis
   * @returns Array com todas as vogais
   */
  static getAvailableVowels(): string[] {
    return [...this.VOWELS];
  }
}
