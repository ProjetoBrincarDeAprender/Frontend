export interface LocationLevel {
  id: number;
  type: 'selection' | 'positioning';
  question: string;
  locationType?: string; // Chave da imagem carregada (acima, abaixo, etc)
  options: LocationOption[];
  correctAnswer: number;
  // Para níveis de posicionamento
  catPosition?: 'left' | 'right';
  dudaPosition?: 'center';
}

export interface LocationOption {
  text: string;
  isCorrect: boolean;
}

export class LocationsGameData {
  static getLevels(): LocationLevel[] {
    return [
      {
        id: 1,
        type: 'selection',
        question: 'O gato está ___ da cadeira',
        locationType: 'acima',
        options: [
          { text: 'ACIMA', isCorrect: true },
          { text: 'ABAIXO', isCorrect: false },
          { text: 'LADO', isCorrect: false }
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        type: 'selection',
        question: 'O cachorro está ___ da mesa',
        locationType: 'abaixo',
        options: [
          { text: 'ACIMA', isCorrect: false },
          { text: 'ABAIXO', isCorrect: true },
          { text: 'DENTRO', isCorrect: false }
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        type: 'selection',
        question: 'O cachorro está ___ da caixa',
        locationType: 'dentro',
        options: [
          { text: 'FORA', isCorrect: false },
          { text: 'DENTRO', isCorrect: true },
          { text: 'LADO', isCorrect: false }
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        type: 'selection',
        question: 'A ração está na ___ do cachorro',
        locationType: 'frente',
        options: [
          { text: 'ATRÁS', isCorrect: false },
          { text: 'LADO', isCorrect: false },
          { text: 'FRENTE', isCorrect: true }
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        type: 'selection',
        question: 'O rato está ao ___ do gato',
        locationType: 'lado',
        options: [
          { text: 'LADO', isCorrect: true },
          { text: 'DENTRO', isCorrect: false },
          { text: 'ACIMA', isCorrect: false }
        ],
        correctAnswer: 0
      },
      // Níveis de posicionamento (6-10)
      {
        id: 6,
        type: 'positioning',
        question: 'O gato está à ESQUERDA da Duda?',
        options: [
          { text: 'ESQUERDA', isCorrect: true },
          { text: 'DIREITA', isCorrect: false }
        ],
        correctAnswer: 0,
        catPosition: 'left',
        dudaPosition: 'center'
      },
      {
        id: 7,
        type: 'positioning',
        question: 'O gato está à DIREITA da Duda?',
        options: [
          { text: 'ESQUERDA', isCorrect: false },
          { text: 'DIREITA', isCorrect: true }
        ],
        correctAnswer: 1,
        catPosition: 'right',
        dudaPosition: 'center'
      },
      {
        id: 8,
        type: 'positioning',
        question: 'O gato está à ESQUERDA da Duda?',
        options: [
          { text: 'ESQUERDA', isCorrect: true },
          { text: 'DIREITA', isCorrect: false }
        ],
        correctAnswer: 0,
        catPosition: 'left',
        dudaPosition: 'center'
      },
      {
        id: 9,
        type: 'positioning',
        question: 'O gato está à DIREITA da Duda?',
        options: [
          { text: 'ESQUERDA', isCorrect: false },
          { text: 'DIREITA', isCorrect: true }
        ],
        correctAnswer: 1,
        catPosition: 'right',
        dudaPosition: 'center'
      },
      {
        id: 10,
        type: 'positioning',
        question: 'O gato está à ESQUERDA da Duda?',
        options: [
          { text: 'ESQUERDA', isCorrect: false },
          { text: 'DIREITA', isCorrect: true }
        ],
        correctAnswer: 1,
        catPosition: 'right',
        dudaPosition: 'center'
      }
    ];
  }

  static getTotalLevels(): number {
    return this.getLevels().length;
  }

  static getLevel(levelIndex: number): LocationLevel | null {
    const levels = this.getLevels();
    return levels[levelIndex] || null;
  }
}