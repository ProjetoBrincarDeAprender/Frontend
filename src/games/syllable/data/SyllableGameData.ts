export interface IntroductoryLevel {
  id: number;
  title: string;
  content: string;
  example?: {
    word: string;
    emoji: string;
    syllableCount: number;
    syllableType: 'monossílaba' | 'dissílaba' | 'trissílaba' | 'polissílaba';
  };
}

export interface GameLevel {
  id: number;
  word: string;
  emoji: string;
  syllableCount: number;
  syllableType: 'monossílaba' | 'dissílaba' | 'trissílaba' | 'polissílaba';
  options: {
    text: string;
    value: number | string;
    isCorrect: boolean;
  }[];
}

export class SyllableGameData {
  static readonly introductoryLevels: IntroductoryLevel[] = [
    {
      id: 1,
      title: "BEM-VINDOS AO JOGO DAS SÍLABAS!",
      content: "Vamos aprender a contar sílabas nas palavras!\nCada palavra pode ter 1, 2, 3 ou mais sílabas."
    },
    {
      id: 2,
      title: "MONOSSÍLABA",
      content: "Palavras com apenas UMA sílaba:",
      example: {
        word: "SOL",
        emoji: "☀️",
        syllableCount: 1,
        syllableType: 'monossílaba'
      }
    },
    {
      id: 3,
      title: "DISSÍLABA",
      content: "Palavras com DUAS sílabas:",
      example: {
        word: "CASA",
        emoji: "🏠",
        syllableCount: 2,
        syllableType: 'dissílaba'
      }
    },
    {
      id: 4,
      title: "TRISSÍLABA",
      content: "Palavras com TRÊS sílabas:",
      example: {
        word: "TELEFONE",
        emoji: "📞",
        syllableCount: 3,
        syllableType: 'trissílaba'
      }
    },
    {
      id: 5,
      title: "POLISSÍLABA",
      content: "Palavras com QUATRO ou mais sílabas:",
      example: {
        word: "BICICLETA",
        emoji: "🚲",
        syllableCount: 4,
        syllableType: 'polissílaba'
      }
    },
    {
      id: 6,
      title: "AGORA VAMOS PRATICAR!",
      content: "Você vai ver palavras e precisa contar quantas sílabas elas têm.\nVamos começar!"
    }
  ];

  static readonly level1Words: GameLevel[] = [
    {
      id: 1,
      word: "PÉ",
      emoji: "🦶",
      syllableCount: 1,
      syllableType: 'monossílaba',
      options: [
        { text: "1", value: 1, isCorrect: true },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: false }
      ]
    },
    {
      id: 2,
      word: "BOLA",
      emoji: "⚽",
      syllableCount: 2,
      syllableType: 'dissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: true },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: false }
      ]
    },
    {
      id: 3,
      word: "GATO",
      emoji: "🐱",
      syllableCount: 2,
      syllableType: 'dissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: true },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: false }
      ]
    },
    {
      id: 4,
      word: "MAR",
      emoji: "🌊",
      syllableCount: 1,
      syllableType: 'monossílaba',
      options: [
        { text: "1", value: 1, isCorrect: true },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: false }
      ]
    },
    {
      id: 5,
      word: "BOLO",
      emoji: "🎂",
      syllableCount: 2,
      syllableType: 'dissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: true },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: false }
      ]
    }
  ];

  static readonly level2Words: GameLevel[] = [
    {
      id: 1,
      word: "BANANA",
      emoji: "🍌",
      syllableCount: 3,
      syllableType: 'trissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: true },
        { text: "4+", value: 4, isCorrect: false }
      ]
    },
    {
      id: 2,
      word: "COMPUTADOR",
      emoji: "💻",
      syllableCount: 4,
      syllableType: 'polissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: true }
      ]
    },
    {
      id: 3,
      word: "ELEFANTE",
      emoji: "🐘",
      syllableCount: 4,
      syllableType: 'polissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: true }
      ]
    },
    {
      id: 4,
      word: "JANELA",
      emoji: "🪟",
      syllableCount: 3,
      syllableType: 'trissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: true },
        { text: "4+", value: 4, isCorrect: false }
      ]
    },
    {
      id: 5,
      word: "BORBOLETA",
      emoji: "🦋",
      syllableCount: 4,
      syllableType: 'polissílaba',
      options: [
        { text: "1", value: 1, isCorrect: false },
        { text: "2", value: 2, isCorrect: false },
        { text: "3", value: 3, isCorrect: false },
        { text: "4+", value: 4, isCorrect: true }
      ]
    }
  ];

  static readonly level3Words: GameLevel[] = [
    {
      id: 1,
      word: "LIVRO",
      emoji: "📚",
      syllableCount: 2,
      syllableType: 'dissílaba',
      options: [
        { text: "MONOSSÍLABA", value: "mono", isCorrect: false },
        { text: "DISSÍLABA", value: "di", isCorrect: true },
        { text: "TRISSÍLABA", value: "tri", isCorrect: false },
        { text: "POLISSÍLABA", value: "poli", isCorrect: false }
      ]
    },
    {
      id: 2,
      word: "TELEVISÃO",
      emoji: "📺",
      syllableCount: 4,
      syllableType: 'polissílaba',
      options: [
        { text: "MONOSSÍLABA", value: "mono", isCorrect: false },
        { text: "DISSÍLABA", value: "di", isCorrect: false },
        { text: "TRISSÍLABA", value: "tri", isCorrect: false },
        { text: "POLISSÍLABA", value: "poli", isCorrect: true }
      ]
    },
    {
      id: 3,
      word: "SOL",
      emoji: "☀️",
      syllableCount: 1,
      syllableType: 'monossílaba',
      options: [
        { text: "MONOSSÍLABA", value: "mono", isCorrect: true },
        { text: "DISSÍLABA", value: "di", isCorrect: false },
        { text: "TRISSÍLABA", value: "tri", isCorrect: false },
        { text: "POLISSÍLABA", value: "poli", isCorrect: false }
      ]
    },
    {
      id: 4,
      word: "CACHORRO",
      emoji: "🐶",
      syllableCount: 3,
      syllableType: 'trissílaba',
      options: [
        { text: "MONOSSÍLABA", value: "mono", isCorrect: false },
        { text: "DISSÍLABA", value: "di", isCorrect: false },
        { text: "TRISSÍLABA", value: "tri", isCorrect: true },
        { text: "POLISSÍLABA", value: "poli", isCorrect: false }
      ]
    },
    {
      id: 5,
      word: "ÁRVORE",
      emoji: "🌳",
      syllableCount: 3,
      syllableType: 'trissílaba',
      options: [
        { text: "MONOSSÍLABA", value: "mono", isCorrect: false },
        { text: "DISSÍLABA", value: "di", isCorrect: false },
        { text: "TRISSÍLABA", value: "tri", isCorrect: true },
        { text: "POLISSÍLABA", value: "poli", isCorrect: false }
      ]
    }
  ];

  static getIntroductoryLevel(index: number): IntroductoryLevel | null {
    return this.introductoryLevels[index] || null;
  }

  static getLevel1Word(index: number): GameLevel | null {
    return this.level1Words[index] || null;
  }

  static getLevel2Word(index: number): GameLevel | null {
    return this.level2Words[index] || null;
  }

  static getLevel3Word(index: number): GameLevel | null {
    return this.level3Words[index] || null;
  }

  static getIntroductoryCount(): number {
    return this.introductoryLevels.length;
  }

  static getLevel1Count(): number {
    return this.level1Words.length;
  }

  static getLevel2Count(): number {
    return this.level2Words.length;
  }

  static getLevel3Count(): number {
    return this.level3Words.length;
  }

  static getTotalLevels(): number {
    return this.getIntroductoryCount() + this.getLevel1Count() + this.getLevel2Count() + this.getLevel3Count();
  }

  static isIntroductoryPhase(currentLevel: number): boolean {
    return currentLevel < this.getIntroductoryCount();
  }

  static isLevel1Phase(currentLevel: number): boolean {
    return currentLevel >= this.getIntroductoryCount() && 
           currentLevel < this.getIntroductoryCount() + this.getLevel1Count();
  }

  static isLevel2Phase(currentLevel: number): boolean {
    return currentLevel >= this.getIntroductoryCount() + this.getLevel1Count() && 
           currentLevel < this.getIntroductoryCount() + this.getLevel1Count() + this.getLevel2Count();
  }

  static isLevel3Phase(currentLevel: number): boolean {
    return currentLevel >= this.getIntroductoryCount() + this.getLevel1Count() + this.getLevel2Count();
  }

  static shouldShowLevelComplete(currentLevel: number): boolean {
    const level1End = this.getLevel1Count();
    const level2End = level1End + this.getLevel2Count();
    
    return currentLevel === level1End || currentLevel === level2End;
  }
}