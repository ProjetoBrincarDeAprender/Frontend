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

  // Phase 1.5: Identify tonic syllable with shuffled options (5 levels)
  static readonly phase15Levels: TonicStressLevel[] = [
    {
      id: 6,
      word: "COMPUTADOR",
      emoji: "💻",
      syllables: ["COM", "PU", "TA", "DOR"],
      tonicSyllableIndex: 3,
      classification: 'oxítona'
    },
    {
      id: 7,
      word: "TELEFONE",
      emoji: "📞",
      syllables: ["TE", "LE", "FO", "NE"],
      tonicSyllableIndex: 2,
      classification: 'paroxítona'
    },
    {
      id: 8,
      word: "ELÉTRICO",
      emoji: "⚡",
      syllables: ["E", "LÉ", "TRI", "CO"],
      tonicSyllableIndex: 1,
      classification: 'proparoxítona'
    },
    {
      id: 9,
      word: "PROFESSOR",
      emoji: "👨‍🏫",
      syllables: ["PRO", "FES", "SOR"],
      tonicSyllableIndex: 2,
      classification: 'oxítona'
    },
    {
      id: 10,
      word: "MÁQUINA",
      emoji: "⚙️",
      syllables: ["MÁ", "QUI", "NA"],
      tonicSyllableIndex: 0,
      classification: 'proparoxítona'
    }
  ];

  // Phase 2: Classify word stress (5 levels)
  static readonly phase2Levels: TonicStressLevel[] = [
    {
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      id: 15,
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

  static getPhase15Count(): number {
    return this.phase15Levels.length;
  }

  static getPhase2Count(): number {
    return this.phase2Levels.length;
  }

  static getTotalLevels(): number {
    return this.phase1Levels.length + this.phase15Levels.length + this.phase2Levels.length;
  }

  static getPhase1Level(index: number): TonicStressLevel | null {
    return this.phase1Levels[index] || null;
  }

  static getPhase15Level(index: number): TonicStressLevel | null {
    return this.phase15Levels[index] || null;
  }

  static getPhase2Level(index: number): TonicStressLevel | null {
    return this.phase2Levels[index] || null;
  }

  static shouldShowLevelComplete(currentLevel: number): boolean {
    return currentLevel === this.getPhase1Count() || currentLevel === this.getPhase1Count() + this.getPhase15Count();
  }

  static shuffleSyllables(syllables: string[], tonicIndex: number): { shuffled: string[], correctIndex: number } {
    const syllablesCopy = [...syllables];
    const tonicSyllable = syllables[tonicIndex];
    
    // Fisher-Yates shuffle
    for (let i = syllablesCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [syllablesCopy[i], syllablesCopy[j]] = [syllablesCopy[j], syllablesCopy[i]];
    }
    
    // Find new index of tonic syllable
    const newTonicIndex = syllablesCopy.findIndex(syl => syl === tonicSyllable);
    
    return {
      shuffled: syllablesCopy,
      correctIndex: newTonicIndex
    };
  }
}