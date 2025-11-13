import { SyllableGameDataGenerator } from "./SyllableGameDataGenerator";

export class ComplexSyllableDataGenerator extends SyllableGameDataGenerator {
  /**
   * Gera a configuração de áudio para uma consoante específica
   * @param consonant A consoante selecionada
   * @returns Array com a configuração de áudios
   */
  protected static override generateAudioConfig(consonant: string): any[] {
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
      path: `/assets/complexSyllableGame/sounds/${consonant}${vowel}.m4a`,
    }));

    return [...baseAudios, ...syllableAudios];
  }

  /**
   * Gera os dados completos do jogo para uma consoante específica
   * @param consonant A consoante selecionada
   * @returns Objeto com todos os dados necessários para o jogo
   */
  static override generateGameData(consonant: string): any {
    const levels = this.generateLevels(consonant);
    const audios = this.generateAudioConfig(consonant);

    return {
      config: {
        background: {
          image: "/assets/complexSyllableGame/images/backgroundStart.png",
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
      "VR",
      "BL",
      "CL",
      "FL",
      "GL",
      "PL",
      "TL",
      "VL",
      "CH",
      "NH",
      "LH",
    ];
  }
}
