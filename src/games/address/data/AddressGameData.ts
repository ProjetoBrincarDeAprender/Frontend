export interface TrueFalseQuestion {
  id: number;
  question: string;
  isTrue: boolean;
  explanation?: string;
}

export interface ImageSelectionLevel {
  id: number;
  question: string;
  images: {
    path: string;
    key: string;
    isCorrect: boolean;
    type: 'residential' | 'industrial' | 'commercial' | 'rural' | 'mixed';
  }[];
  correctType: 'residential' | 'industrial' | 'commercial' | 'rural' | 'mixed';
}

export class AddressGameData {
  static readonly trueFalseQuestions: TrueFalseQuestion[] = [
    {
      id: 1,
      question: "Todos os bairros são iguais",
      isTrue: false,
    //   explanation: "Os bairros podem ser residenciais, comerciais, industriais, rurais ou mistos."
    },
    {
      id: 2,
      question: "Os bairros são parte de uma cidade",
      isTrue: true,
    //   explanation: "Sim! Os bairros fazem parte de uma cidade."
    },
    {
      id: 3,
      question: "As ruas são partes de um bairro",
      isTrue: true,
    //   explanation: "Correto! As ruas ficam dentro dos bairros."
    },
    {
      id: 4,
      question: "Só existem bairros residenciais",
      isTrue: false,
    //   explanation: "Existem vários tipos de bairros: residenciais, comerciais, industriais, rurais e mistos."
    },
    {
      id: 5,
      question: "O conjunto de quadras, casas, ruas e praças são chamados de bairros",
      isTrue: true,
    //   explanation: "Exato! Quando juntamos quadras, casas, ruas e praças temos um bairro."
    }
  ];

  static readonly imageSelectionLevels: ImageSelectionLevel[] = [
    {
      id: 1,
      question: "Qual é um bairro RESIDENCIAL?",
      correctType: 'residential',
      images: [
        {
          path: "/assets/address/residential_neighborhood.jpg",
          key: "residential_neighborhood",
          isCorrect: true,
          type: 'residential'
        },
        {
          path: "/assets/address/industrial_neighborhood.jpg", 
          key: "industrial_neighborhood",
          isCorrect: false,
          type: 'industrial'
        },
        {
          path: "/assets/address/commercial_neighborhood.jpg",
          key: "commercial_neighborhood", 
          isCorrect: false,
          type: 'commercial'
        }
      ]
    },
    {
      id: 2,
      question: "Qual é um bairro INDUSTRIAL?",
      correctType: 'industrial',
      images: [
        {
          path: "/assets/address/commercial_neighborhood.jpg",
          key: "commercial_neighborhood2",
          isCorrect: false,
          type: 'commercial'
        },
        {
          path: "/assets/address/industrial_neighborhood.jpg",
          key: "industrial_neighborhood2",
          isCorrect: true,
          type: 'industrial'
        },
        {
          path: "/assets/address/rural_neighborhood.jpg",
          key: "rural_neighborhood",
          isCorrect: false,
          type: 'rural'
        }
      ]
    },
    {
      id: 3,
      question: "Qual é um bairro COMERCIAL?",
      correctType: 'commercial',
      images: [
        {
          path: "/assets/address/rural_neighborhood.jpg",
          key: "rural_neighborhood2",
          isCorrect: false,
          type: 'rural'
        },
        {
          path: "/assets/address/commercial_neighborhood.jpg",
          key: "commercial_neighborhood3",
          isCorrect: true,
          type: 'commercial'
        },
        {
          path: "/assets/address/residential_neighborhood.jpg",
          key: "residential_neighborhood2",
          isCorrect: false,
          type: 'residential'
        }
      ]
    },
    {
      id: 4,
      question: "Qual é um bairro RURAL?",
      correctType: 'rural',
      images: [
        {
          path: "/assets/address/mixed_neighborhood.jpg",
          key: "mixed_neighborhood",
          isCorrect: false,
          type: 'mixed'
        },
        {
          path: "/assets/address/rural_neighborhood.jpg",
          key: "rural_neighborhood3",
          isCorrect: true,
          type: 'rural'
        },
        {
          path: "/assets/address/industrial_neighborhood.jpg",
          key: "industrial_neighborhood3",
          isCorrect: false,
          type: 'industrial'
        }
      ]
    },
    {
      id: 5,
      question: "Qual é um bairro MISTO?",
      correctType: 'mixed',
      images: [
        {
          path: "/assets/address/residential_neighborhood.jpg",
          key: "residential_neighborhood3",
          isCorrect: false,
          type: 'residential'
        },
        {
          path: "/assets/address/mixed_neighborhood.jpg",
          key: "mixed_neighborhood2",
          isCorrect: true,
          type: 'mixed'
        },
        {
          path: "/assets/address/commercial_neighborhood.jpg",
          key: "commercial_neighborhood4",
          isCorrect: false,
          type: 'commercial'
        }
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