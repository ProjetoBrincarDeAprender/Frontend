import { APIDataService } from "@/games/common/services/APIData.service";
import type { LocationLevel } from '../data/LocationsGameData';

export interface InteractionData {
  studentId: number;
  activityId: number;
  questionId: number;
  answer: string;
  timeSpent: number;
  attempts: number;
  neededHint: boolean;
  responseDate: string;
  isCorrect: boolean;
  [key: string]: unknown;
}

export class LocationsGameService {
  private apiService: APIDataService;
  private static readonly ACTIVITY_ID = 4; // ID específico para o jogo de localizações
  private static readonly DEFAULT_STUDENT_ID = 10130001; // ID padrão quando não há aluno logado
  private startTime: number = 0;
  private attempts: number = 0;
  private hintsUsed: boolean = false;
  private score: number = 0;
  private currentLevel: number = 0;

  constructor(scene: Phaser.Scene) {
    this.apiService = new APIDataService(scene);
    this.reset();
    this.startQuestion();
  }
  reset(): void {
    this.score = 0;
    this.currentLevel = 0;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  getScore(): number {
    return this.score;
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

  isCorrectAnswer(selectedOption: number, level: LocationLevel): boolean {
    return selectedOption === level.correctAnswer;
  }

  calculateScore(_level: LocationLevel, timeBonus: number = 0): number {
    const baseScore = 100;
    return baseScore + timeBonus;
  }

  getProgressPercentage(totalLevels: number): number {
    return Math.round((this.currentLevel / totalLevels) * 100);
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
    studentId: number,
    questionId: number,
    answer: string,
    isCorrect: boolean,
  ): Promise<void> {
    try {
      const timeSpent = Date.now() - this.startTime;

      const interactionData: InteractionData = {
        studentId: studentId,
        activityId: LocationsGameService.ACTIVITY_ID,
        questionId,
        answer,
        timeSpent,
        attempts: this.attempts,
        neededHint: this.hintsUsed,
        responseDate: new Date().toISOString(),
        isCorrect,
      };

      this.apiService.sendGameData(
        interactionData.activityId,
        interactionData.questionId,
        interactionData,
      );
    } catch (error) {
      console.error("❌ Erro ao registrar interação:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status: number; data: unknown; headers: unknown };
        };
        console.error("Status:", axiosError.response?.status);
      }
    }
  }

  async registerCorrectAnswer(
    studentId: number,
    questionId: number,
    answer: string,
  ): Promise<void> {
    await this.registerInteraction(studentId, questionId, answer, true);
  }

  async registerIncorrectAnswer(
    studentId: number,
    questionId: number,
    answer: string,
  ): Promise<void> {
    await this.registerInteraction(studentId, questionId, answer, false);
  }

  getStudentId(): number {
    const userData = this.apiService["getUser"]();
    const userId = userData?.codigo_usuario;
    return typeof userId === 'number' ? userId : parseInt(String(userId)) || LocationsGameService.DEFAULT_STUDENT_ID;
  }

  isAuthenticated(): boolean {
    return !!this.apiService["getUser"]();
  }
}