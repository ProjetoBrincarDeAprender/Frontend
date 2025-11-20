export interface TrueFalseQuestion {
  id: number;
  question: string;
  isTrue: boolean;
  explanation?: string;
}

export interface ImageSelectionLevel {
  id: number;
  image: {
    path: string;
    key: string;
    type: 'residential' | 'industrial' | 'commercial' | 'rural' | 'mixed';
  };
  options: {
    text: string;
    isCorrect: boolean;
    type: 'residential' | 'industrial' | 'commercial' | 'rural' | 'mixed';
  }[];
}

export class AddressGameData {
  static readonly trueFalseQuestions: TrueFalseQuestion[] = [
    {
      id: 1,
      question: "TODOS OS BAIRROS SÃO IGUAIS",
      isTrue: false,
    //   explanation: "Os bairros podem ser residenciais, comerciais, industriais, rurais ou mistos."
    },
    {
      id: 2,
      question: "OS BAIRROS SÃO PARTE DE UMA CIDADE",
      isTrue: true,
    //   explanation: "Sim! Os bairros fazem parte de uma cidade."
    },
    {
      id: 3,
      question: "AS RUAS SÃO PARTES DE UM BAIRRO",
      isTrue: true,
    //   explanation: "Correto! As ruas ficam dentro dos bairros."
    },
    {
      id: 4,
      question: "SÓ EXISTEM BAIRROS RESIDENCIAIS",
      isTrue: false,
    //   explanation: "Existem vários tipos de bairros: residenciais, comerciais, industriais, rurais e mistos."
    },
    {
      id: 5,
      question: "O CONJUNTO DE QUADRAS, CASAS, RUAS E PRAÇAS SÃO CHAMADOS DE BAIRROS",
      isTrue: true,
    //   explanation: "Exato! Quando juntamos quadras, casas, ruas e praças temos um bairro."
    }
  ];

  static readonly imageSelectionLevels: ImageSelectionLevel[] = [
    {
      id: 1,
      image: {
        path: "/assets/addressGame/residential_neighborhood.jpg",
        key: "residential_neighborhood",
        type: 'residential'
      },
      options: [
        { text: "RESIDENCIAL", isCorrect: true, type: 'residential' },
        { text: "INDUSTRIAL", isCorrect: false, type: 'industrial' },
        { text: "COMERCIAL", isCorrect: false, type: 'commercial' }
      ]
    },
    {
      id: 2,
      image: {
        path: "/assets/addressGame/industrial_neighborhood.jpg",
        key: "industrial_neighborhood",
        type: 'industrial'
      },
      options: [
        { text: "COMERCIAL", isCorrect: false, type: 'commercial' },
        { text: "INDUSTRIAL", isCorrect: true, type: 'industrial' },
        { text: "RURAL", isCorrect: false, type: 'rural' }
      ]
    },
    {
      id: 3,
      image: {
        path: "/assets/addressGame/commercial_neighborhood.jpg",
        key: "commercial_neighborhood",
        type: 'commercial'
      },
      options: [
        { text: "RURAL", isCorrect: false, type: 'rural' },
        { text: "RESIDENCIAL", isCorrect: false, type: 'residential' } ,
        { text: "COMERCIAL", isCorrect: true, type: 'commercial' }
      ]
    },
    {
      id: 4,
      image: {
        path: "/assets/addressGame/rural_neighborhood.jpg",
        key: "rural_neighborhood",
        type: 'rural'
      },
      options: [
        { text: "MISTO", isCorrect: false, type: 'mixed' },
        { text: "RURAL", isCorrect: true, type: 'rural' },
        { text: "INDUSTRIAL", isCorrect: false, type: 'industrial' }
      ]
    },
    {
      id: 5,
      image: {
        path: "/assets/addressGame/mixed_neighborhood.jpg",
        key: "mixed_neighborhood",
        type: 'mixed'
      },
      options: [ { text: "MISTO", isCorrect: true, type: 'mixed' },
        { text: "RESIDENCIAL", isCorrect: false, type: 'residential' },
        { text: "COMERCIAL", isCorrect: false, type: 'commercial' }
      ]
    }
  ];

  static getTrueFalseQuestion(index: number): TrueFalseQuestion | null {
    return this.trueFalseQuestions[index] || null;
  }

  static getImageSelectionLevel(index: number): ImageSelectionLevel | null {
    return this.imageSelectionLevels[index] || null;
  }

  static getTrueFalseCount(): number {
    return this.trueFalseQuestions.length;
  }

  static getImageSelectionCount(): number {
    return this.imageSelectionLevels.length;
  }

  static getTotalLevels(): number {
    return this.getTrueFalseCount() + this.getImageSelectionCount();
  }

  static isInTrueFalsePhase(currentLevel: number): boolean {
    return currentLevel < this.getTrueFalseCount();
  }
}