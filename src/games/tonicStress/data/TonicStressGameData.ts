export interface TonicStressLevel {
  id: number;
  word: string;
  emoji: string;
  syllables: string[];
  tonicSyllableIndex: number; // Index of the tonic syllable
  classification: 'oxítona' | 'paroxítona' | 'proparoxítona';
  options?: {
    text: string;
    value: string | number;
    isCorrect: boolean;
  }[];
}

export class TonicStressGameData {
  // Phase 1: Identify tonic syllable (5 levels)
  static readonly phase1Levels: TonicStressLevel[] = [
    {
      id: 1,
      word: "CAFÉ",
      emoji: "☕",
      syllables: ["CA", "FÉ"],
      tonicSyllableIndex: 1,
      classification: 'oxítona'
    },
    {
      id: 2,
      word: "CASA",
      emoji: "🏠",
      syllables: ["CA", "SA"],
      tonicSyllableIndex: 0,
      classification: 'paroxítona'
    },
    {
      id: 3,
      word: "MÉDICO",
      emoji: "👨‍⚕️",
      syllables: ["MÉ", "DI", "CO"],
      tonicSyllableIndex: 0,
      classification: 'proparoxítona'
    },
    {
      id: 4,
      word: "JARDIM",
      emoji: "🌻",
      syllables: ["JAR", "DIM"],
      tonicSyllableIndex: 1,
      classification: 'oxítona'
    },
    {
      id: 5,
      word: "ÁRVORE",
      emoji: "🌳",
      syllables: ["ÁR", "VO", "RE"],
      tonicSyllableIndex: 0,
      classification: 'proparoxítona'
    }
  ];

  // Phase 2: Classify word stress (5 levels)
  static readonly phase2Levels: TonicStressLevel[] = [
    {
      id: 6,
      word: "AMOR",
      emoji: "❤️",
      syllables: ["A", "MOR"],
      tonicSyllableIndex: 1,
      classification: 'oxítona',
      options: [
        { text: "OXÍTONA", value: "oxítona", isCorrect: true },
        { text: "PAROXÍTONA", value: "paroxítona", isCorrect: false },
        { text: "PROPAROXÍTONA", value: "proparoxítona", isCorrect: false }
      ]
    },
    {
      id: 7,
      word: "LIVRO",
      emoji: "📖",
      syllables: ["LI", "VRO"],
      tonicSyllableIndex: 0,
      classification: 'paroxítona',
      options: [
        { text: "OXÍTONA", value: "oxítona", isCorrect: false },
        { text: "PAROXÍTONA", value: "paroxítona", isCorrect: true },
        { text: "PROPAROXÍTONA", value: "proparoxítona", isCorrect: false }
      ]
    },
    {
      id: 8,
      word: "MÚSICA",
      emoji: "🎵",
      syllables: ["MÚ", "SI", "CA"],
      tonicSyllableIndex: 0,
      classification: 'proparoxítona',
      options: [
        { text: "OXÍTONA", value: "oxítona", isCorrect: false },
        { text: "PAROXÍTONA", value: "paroxítona", isCorrect: false },
        { text: "PROPAROXÍTONA", value: "proparoxítona", isCorrect: true }
      ]
    },
    {
      id: 9,
      word: "PARABÉNS",
      emoji: "🎉",
      syllables: ["PA", "RA", "BÉNS"],
      tonicSyllableIndex: 2,
      classification: 'oxítona',
      options: [
        { text: "OXÍTONA", value: "oxítona", isCorrect: true },
        { text: "PAROXÍTONA", value: "paroxítona", isCorrect: false },
        { text: "PROPAROXÍTONA", value: "proparoxítona", isCorrect: false }
      ]
    },
    {
      id: 10,
      word: "PÁSSARO",
      emoji: "🐦",
      syllables: ["PÁS", "SA", "RO"],
      tonicSyllableIndex: 0,
      classification: 'proparoxítona',
      options: [
        { text: "OXÍTONA", value: "oxítona", isCorrect: false },
        { text: "PAROXÍTONA", value: "paroxítona", isCorrect: false },
        { text: "PROPAROXÍTONA", value: "proparoxítona", isCorrect: true }
      ]
    }
  ];

  static getPhase1Count(): number {
    return this.phase1Levels.length;
  }

  static getPhase2Count(): number {
    return this.phase2Levels.length;
  }

  static getTotalLevels(): number {
    return this.phase1Levels.length + this.phase2Levels.length;
  }

  static getPhase1Level(index: number): TonicStressLevel | null {
    return this.phase1Levels[index] || null;
  }

  static getPhase2Level(index: number): TonicStressLevel | null {
    return this.phase2Levels[index] || null;
  }

  static shouldShowLevelComplete(currentLevel: number): boolean {
    return currentLevel === this.getPhase1Count();
  }
}