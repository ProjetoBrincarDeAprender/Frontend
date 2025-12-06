import { APIDataService } from "@/games/common/services/APIData.service";

export interface InteractionData {
  answer: string;
  timeSpent: number;
  attempts: number;
  neededHint: boolean;
  isCorrect: boolean;
}

export class TonicStressGameService {
  private static readonly ACTIVITY_ID = 5;
  private startTime: number = 0;
  private attempts: number = 0;
  private hintsUsed: boolean = false;
  private apiService: APIDataService;
  private currentLevel: number = 0;
  private score: number = 0;

  constructor(scene: Phaser.Scene) {
    this.apiService = new APIDataService(scene);
  }

  setCurrentLevel(level: number): void {
    this.currentLevel = level;
  }

  incrementLevel(): void {
    this.currentLevel++;
  }

  addScore(points: number): void {
    this.score += points;
  }

  getScore(): number {
    return this.score;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  incrementAttempts(): void {
    this.attempts++;
  }

  useHint(): void {
    this.hintsUsed = true;
  }

  getAttempts(): number {
    return this.attempts;
  }

  startQuestion(): void {
    this.startTime = Date.now();
    this.attempts = 0;
    this.hintsUsed = false;
  }

  calculateScore(): number {
    return Math.max(20, 100 - Math.max(0, (this.attempts - 1) * 20));
  }

  getStudentId(): number {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        return user?.codigo_usuario || 10130001;
      }
      return 10130001;
    } catch (error) {
      console.error("Erro ao obter ID do estudante:", error);
      return 10130001;
    }
  }

  isCorrectTonicSyllable = (selectedIndex: number, correctIndex: number): boolean => selectedIndex === correctIndex;
  isCorrectClassification = (selectedValue: string, correctValue: string): boolean => selectedValue === correctValue;

  async registerInteraction(questionId: number, answer: string, isCorrect: boolean): Promise<void> {
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
        TonicStressGameService.ACTIVITY_ID,
        questionId,
        interactionData,
      );
    } catch (error) {
      console.error("Erro ao registrar interação:", error);
    }
  }

  async registerCorrectAnswer(questionId: number, answerText: string): Promise<void> {
    await this.registerInteraction(questionId, answerText, true);
  }

  async registerIncorrectAnswer(questionId: number, answerText: string): Promise<void> {
    await this.registerInteraction(questionId, answerText, false);
  }
}