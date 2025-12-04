import { APIDataService } from "../common/services/APIData.service";

interface ArmedSumLevelData {
  level: number;
  numberA: number;
  numberB: number;
  correctAnswer: number;
  userAnswer: string;
  wrongAnswers: number;
  timeSpent: number;
  completed: boolean;
  startTime: number;
}

function getCurrentUser(): { id: number | string; name?: string } {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.codigo_usuario_id || user.codigo_usuario || user.id;
      return {
        id: userId ? parseInt(userId.toString()) : 10130001,
        name: user.nome || user.name,
      };
    }
    return { id: 10130001 };
  } catch (error) {
    return { id: 10130001 };
  }
}

export class ArmedSumDataManager {
  private currentLevelData: ArmedSumLevelData | null = null;
  private activityId: number = 4;
  private apiService: APIDataService;
  private levelsCompleted: number = 0;

  constructor(scene: Phaser.Scene, activityId?: number) {
    if (activityId) {
      this.activityId = activityId;
    }
    this.apiService = new APIDataService(scene);
  }

  startLevel(levelNumber: number, numberA: number, numberB: number): void {
    this.currentLevelData = {
      level: levelNumber,
      numberA,
      numberB,
      correctAnswer: numberA + numberB,
      userAnswer: "",
      wrongAnswers: 0,
      timeSpent: 0,
      completed: false,
      startTime: Date.now(),
    };
  }

  addAnswer(answer: string): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.userAnswer = answer;

    if (parseInt(answer) !== this.currentLevelData.correctAnswer) {
      this.currentLevelData.wrongAnswers++;
    }
  }

  completeLevel(): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.timeSpent =
      (Date.now() - this.currentLevelData.startTime) / 1000;
    this.currentLevelData.completed = true;
    this.levelsCompleted++;

    this.sendLevelData(this.currentLevelData);
    this.currentLevelData = null;
  }

  private async sendLevelData(levelData: ArmedSumLevelData): Promise<void> {
    try {
      const user = getCurrentUser();

      const gameData = {
        studentId: parseInt(user.id.toString()),
        activityId: this.activityId,
        questionId: levelData.level,
        answer: levelData.userAnswer,
        timeSpent: Math.round(levelData.timeSpent),
        attempts: levelData.wrongAnswers + 1,
        neededHint: false,
        responseDate: new Date().toISOString(),
        isCorrect: parseInt(levelData.userAnswer) === levelData.correctAnswer,
      };

      await this.apiService.sendGameData(
        this.activityId,
        levelData.level,
        gameData,
      );
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  }

  getCurrentLevelData(): ArmedSumLevelData | null {
    return this.currentLevelData;
  }
}
