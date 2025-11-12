import { APIDataService } from "@/games/common/services/APIData.service";
import type { TrueFalseQuestion, ImageSelectionLevel } from '../data/AddressGameData';

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

export class AddressGameService {
  private apiService: APIDataService;
  private static readonly ACTIVITY_ID = 8; // ID específico para o jogo de endereços
  private static readonly DEFAULT_STUDENT_ID = 10130001; // ID padrão quando não há aluno logado
  private startTime: number = 0;
  private attempts: number = 0;
  private hintsUsed: boolean = false;

  // Propriedades para manter compatibilidade com a lógica do jogo
  private score: number = 0;
  private currentLevel: number = 0;

  constructor(scene: Phaser.Scene) {
    this.apiService = new APIDataService(scene);
    this.reset();
    this.startQuestion();
  }

  // Métodos para compatibilidade com a lógica existente do jogo
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

  isCorrectTrueFalseAnswer(answer: boolean, question: TrueFalseQuestion): boolean {
    return answer === question.isTrue;
  }

  isCorrectImageSelection(selectedImageIndex: number, level: ImageSelectionLevel): boolean {
    return level.images[selectedImageIndex]?.isCorrect || false;
  }

  calculateScore(): number {
    const baseScore = 100;
    return baseScore;
  }

  getProgressPercentage(totalLevels: number): number {
    return Math.round((this.currentLevel / totalLevels) * 100);
  }

  // Métodos para integração com API
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

  private validateInteractionData(data: InteractionData): boolean {
    const required = [
      "studentId",
      "activityId",
      "questionId",
      "answer",
      "timeSpent",
      "attempts",
      "neededHint",
      "responseDate",
      "isCorrect",
    ];

    for (const field of required) {
      if (
        data[field as keyof InteractionData] === undefined ||
        data[field as keyof InteractionData] === null
      ) {
        console.error(`Campo obrigatório ausente: ${field}`);
        return false;
      }
    }

    if (typeof data.studentId !== "number") {
      console.error("studentId deve ser um número");
      return false;
    }

    if (typeof data.activityId !== "number") {
      console.error("activityId deve ser um número");
      return false;
    }

    if (typeof data.questionId !== "number") {
      console.error("questionId deve ser um número");
      return false;
    }

    if (typeof data.timeSpent !== "number") {
      console.error("timeSpent deve ser um número");
      return false;
    }

    return true;
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
        activityId: AddressGameService.ACTIVITY_ID,
        questionId,
        answer,
        timeSpent,
        attempts: this.attempts,
        neededHint: this.hintsUsed,
        responseDate: new Date().toISOString(),
        isCorrect,
      };

      if (!this.validateInteractionData(interactionData)) {
        console.error("Dados inválidos, não enviando para API");
        return;
      }

      console.log(
        "Registrando interação do jogo de endereços:",
        interactionData,
      );

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
    return typeof userId === 'number' ? userId : parseInt(String(userId)) || AddressGameService.DEFAULT_STUDENT_ID;
  }

  isAuthenticated(): boolean {
    return !!this.apiService["getUser"]();
  }
}