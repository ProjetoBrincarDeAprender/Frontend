export interface SubtractionLevelData {
  level: number;
  number1: number;
  number2: number;
  number3?: number;
  correctAnswer: number;
  userAnswers: number[];
  wrongAnswers: number;
  timeSpent: number;
  startTime: number;
  endTime?: number;
  completed: boolean;
}

export interface SubtractionGameSession {
  gameId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  totalTime: number;
  levelsData: SubtractionLevelData[];
  totalWrongAnswers: number;
  levelsCompleted: number;
  gameCompleted: boolean;
}
