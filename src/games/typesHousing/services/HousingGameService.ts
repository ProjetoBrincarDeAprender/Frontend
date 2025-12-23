import { APIDataService } from "@/games/common/services/APIData.service";
import type { User } from "@/types/user";

export interface InteractionData {
  answer: string;
  timeSpent: number;
  attempts: number;
  neededHint: boolean;
  isCorrect: boolean;
  [key: string]: unknown;
}

export class HousingGameService {
  private static readonly ACTIVITY_ID = 20; // ID específico para o jogo de tipos de moradia
  private startTime: number = 0;
  private attempts: number = 0;
  private hintsUsed: boolean = false;

  private apiService: APIDataService;

  constructor(scene: Phaser.Scene) {
    this.apiService = new APIDataService(scene);
  }

  startQuestion(): void {
    this.startTime = Date.now();
    this.attempts = 0;
    this.hintsUsed = false;
  }

  incrementAttempts(): void {
    this.attempts++;
  }

  useHint(): void {
    this.hintsUsed = true;
  }

  async registerInteraction(
    questionId: number,
    answer: string,
    isCorrect: boolean,
  ): Promise<void> {
    try {
      const timeSpent = Date.now() - this.startTime;

      const interactionData: InteractionData = {
        answer,
        timeSpent,
        attempts: this.attempts,
        neededHint: this.hintsUsed,
        isCorrect,
      };

      this.apiService.sendGameData(
        HousingGameService.ACTIVITY_ID,
        questionId,
        interactionData,
      );
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        // const axiosError = error as {
        //   response?: { status: number; data: unknown; headers: unknown };
        // };
        // console.error(" Detalhes do erro:");
        // console.error("Status:", axiosError.response?.status);
        // console.error("Data:", axiosError.response?.data);
        // console.error("Headers:", axiosError.response?.headers);
      }
    }
  }

  async registerCorrectAnswer(
    questionId: number,
    answer: string,
  ): Promise<void> {
    await this.registerInteraction(questionId, answer, true);
  }

  async registerIncorrectAnswer(
    questionId: number,
    answer: string,
  ): Promise<void> {
    await this.registerInteraction(questionId, answer, false);
  }

  getStudent(): User | null {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user: User = JSON.parse(userData);
        return user;
      }

      return null;
    } catch (error) {
      console.error("Erro ao obter ID do estudante:", error);
      return null;
    }
  }
  isAuthenticated(): boolean {
    try {
      const userData = localStorage.getItem("userData");
      return userData !== null;
    } catch (_error) {
      return false;
    }
  }
}
