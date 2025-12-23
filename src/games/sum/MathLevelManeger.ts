import { APIDataService } from "../common/services/APIData.service";
import MathLevel from "./MathLevel";
import type { SumGameSession, SumLevelData } from "./SumGameData";

interface UserInteraction {
  studentId: number;
  activityId: number;
  questionId: number;
  answer: string;
  timeSpent: number;
  attempts: number;
  neededHint: boolean;
  responseDate: string;
  isCorrect: boolean;
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

    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="));

    if (authToken) {
      return { id: 10130001 };
    }

    return { id: 10130001 };
  } catch (error) {
    console.warn("Erro ao obter usuário:", error);
    return { id: 10130001 };
  }
}

export default class MathLevelManager {
  private levels: MathLevel[];
  private currentIndex: number;

  constructor(levels: MathLevel[]) {
    this.levels = levels;
    this.currentIndex = 0;
  }

  getCurrentLevel(): MathLevel {
    return this.levels[this.currentIndex];
  }

  nextLevel(): boolean {
    if (this.currentIndex < this.levels.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  isFinished(): boolean {
    return this.currentIndex >= this.levels.length - 1;
  }
}

export class SumGameDataManager {
  private gameSession: SumGameSession;
  private currentLevelData: SumLevelData | null = null;
  private activityId: number = 1;
  private apiService: APIDataService;

  constructor(userId: string, scene: Phaser.Scene, activityId?: number) {
    // Garantir que sempre temos um userId válido
    const validUserId =
      userId && userId !== "default_user" ? userId : "10130001";

    this.gameSession = {
      gameId: this.generateGameId(),
      userId: validUserId,
      startTime: Date.now(),
      totalTime: 0,
      levelsData: [],
      totalWrongAnswers: 0,
      levelsCompleted: 0,
      gameCompleted: false,
    };

    if (activityId) {
      this.activityId = activityId;
    }

    this.apiService = new APIDataService(scene);
  }

  private generateGameId(): string {
    return `sum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startLevel(levelNumber: number, number1: number, number2: number): void {
    this.currentLevelData = {
      level: levelNumber,
      number1,
      number2,
      correctAnswer: number1 + number2,
      userAnswers: [],
      wrongAnswers: 0,
      timeSpent: 0,
      startTime: Date.now(),
      completed: false,
    };
  }

  addAnswer(answer: number): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.userAnswers.push(answer);

    if (answer !== this.currentLevelData.correctAnswer) {
      this.currentLevelData.wrongAnswers++;
      this.gameSession.totalWrongAnswers++;
    }
  }

  completeLevel(): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.endTime = Date.now();
    this.currentLevelData.timeSpent =
      (this.currentLevelData.endTime - this.currentLevelData.startTime) / 1000;
    this.currentLevelData.completed = true;
    this.sendLevelData(this.currentLevelData);

    this.gameSession.levelsData.push(this.currentLevelData);
    this.gameSession.levelsCompleted++;

    this.currentLevelData = null;
  }
  async sendLevelData(levelData: SumLevelData): Promise<void> {
    try {
      const user = getCurrentUser();
      const levelInteraction = this.createLevelInteraction(levelData, user);

      console.log(JSON.stringify(levelInteraction, null, 2));

      const response = await this.apiService.sendGameData(
        levelInteraction.activityId,
        levelInteraction.questionId,
        levelInteraction,
      );

      console.log("Resposta:", response?.data);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
        };
        console.error("Status do erro:", axiosError.response?.status);
        console.error("Dados do erro:", axiosError.response?.data);
      }
    }
  }

  private createLevelInteraction(
    levelData: SumLevelData,
    user: { id: number | string; name?: string },
  ): UserInteraction {
    const isCorrect =
      levelData.userAnswers.length > 0 &&
      levelData.userAnswers[levelData.userAnswers.length - 1] ===
        levelData.correctAnswer;

    const levelResult = {
      levelNumber: levelData.level,
      operation: `${levelData.number1} + ${levelData.number2}`,
      correctAnswer: levelData.correctAnswer,
      userAnswers: levelData.userAnswers,
      isCorrect: isCorrect,
      wrongAnswers: levelData.wrongAnswers,
      timeSpent: Math.round(levelData.timeSpent),
      userId: user.id || 10130001,
      userName: user.name || "Usuário Anônimo",
    };

    return {
      studentId:
        typeof user.id === "number"
          ? user.id
          : parseInt(user.id.toString()) || 10130001,
      activityId: this.activityId,
      questionId: levelData.level,
      answer: JSON.stringify(levelResult),
      timeSpent: Math.round(levelData.timeSpent * 1000),
      attempts: levelData.userAnswers.length,
      neededHint: false,
      responseDate: new Date().toISOString(),
      isCorrect: isCorrect,
    };
  }

  completeGame(): void {
    this.gameSession.endTime = Date.now();
    this.gameSession.totalTime =
      (this.gameSession.endTime - this.gameSession.startTime) / 1000;
    this.gameSession.gameCompleted = true;
  }

  getGameData(): SumGameSession {
    return { ...this.gameSession };
  }

  getCurrentLevelData(): SumLevelData | null {
    return this.currentLevelData;
  }

  getInteractionsSummary(): {
    totalInteractions: number;
    levelsCompleted: number;
    totalAnswers: number;
  } {
    return {
      totalInteractions: 1,
      levelsCompleted: this.gameSession.levelsCompleted,
      totalAnswers: this.gameSession.levelsData.reduce(
        (total, level) => total + level.userAnswers.length,
        0,
      ),
    };
  }

  async sendGameData(): Promise<void> {
    try {
      const gameInteraction = this.createGameSummaryInteraction();

      console.log(JSON.stringify(gameInteraction, null, 2));

      const response = await this.apiService.sendGameData(
        gameInteraction.activityId,
        gameInteraction.questionId,
        gameInteraction,
      );

      if (response?.status === 200) {
        console.log("✅ SUCESSO! Status:", response.status);
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
        };
        console.error("Status:", axiosError.response?.status);
        console.error("Status Text:", axiosError.response?.statusText);
        console.error("Response Data:", axiosError.response?.data);
      }
      console.error("Full Error:", error);
      throw error;
    }
  }

  private createGameSummaryInteraction(): UserInteraction {
    const totalCorrectAnswers = this.gameSession.levelsData.filter(
      (level) =>
        level.userAnswers[level.userAnswers.length - 1] === level.correctAnswer,
    ).length;

    const totalWrongAnswers = this.gameSession.totalWrongAnswers;
    const totalTime = this.gameSession.totalTime;

    const gameResult = {
      levelsCompleted: this.gameSession.levelsCompleted,
      correctAnswers: totalCorrectAnswers,
      wrongAnswers: totalWrongAnswers,
      totalTime: Math.round(totalTime),
      accuracy: totalCorrectAnswers / this.gameSession.levelsCompleted,
    };

    return {
      studentId: parseInt(this.gameSession.userId.toString()),
      activityId: this.activityId,
      questionId: 1,
      answer: JSON.stringify(gameResult),
      timeSpent: Math.round(totalTime * 1000),
      attempts: this.gameSession.totalWrongAnswers + 1,
      neededHint: false,
      responseDate: new Date().toISOString(),
      isCorrect: totalCorrectAnswers === this.gameSession.levelsCompleted,
    };
  }

  getInteractionSummary(): {
    studentId: string;
    activityId: number;
    levelsCompleted: number;
    totalWrongAnswers: number;
    totalTime: number;
    willSendAsCorrect: boolean;
  } {
    const totalCorrectAnswers = this.gameSession.levelsData.filter(
      (level) =>
        level.userAnswers[level.userAnswers.length - 1] === level.correctAnswer,
    ).length;

    return {
      studentId: this.gameSession.userId,
      activityId: this.activityId,
      levelsCompleted: this.gameSession.levelsCompleted,
      totalWrongAnswers: this.gameSession.totalWrongAnswers,
      totalTime: this.gameSession.totalTime,
      willSendAsCorrect:
        totalCorrectAnswers === this.gameSession.levelsCompleted,
    };
  }
}
