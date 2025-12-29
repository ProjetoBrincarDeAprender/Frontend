import { APIDataService } from "@/games/common/services/APIData.service";

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

export class ProfessionsGameService {
  private apiService: APIDataService;
  private static readonly ACTIVITY_ID = 16; // ID específico para o jogo de profissões
  private static readonly DEFAULT_STUDENT_ID = 10130001; // ID padrão quando não há aluno logado
  private startTime: number = 0;
  private attempts: number = 0;
  private hintsUsed: boolean = false;

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

    // Validações específicas
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
        activityId: ProfessionsGameService.ACTIVITY_ID,
        questionId,
        answer,
        timeSpent,
        attempts: this.attempts,
        neededHint: this.hintsUsed,
        responseDate: new Date().toISOString(),
        isCorrect,
      };

      // Validar dados antes de enviar
      if (!this.validateInteractionData(interactionData)) {
        console.error("Dados inválidos, não enviando para API");
        return;
      }

      console.log(
        "Registrando interação do jogo de profissões:",
        interactionData,
      );

      this.apiService.sendGameData(
        interactionData.activityId,
        interactionData.questionId,
        interactionData,
      );
    } catch (error) {
      console.error("❌ Erro ao registrar interação:", error);

      // Log mais detalhado do erro para debug
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
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        const id = user.id || user.studentId;
        if (id) {
          return typeof id === "string" ? parseInt(id, 10) : id;
        }
      }
      console.log(
        `Usando ID padrão: ${ProfessionsGameService.DEFAULT_STUDENT_ID}`,
      );
      return ProfessionsGameService.DEFAULT_STUDENT_ID;
    } catch (error) {
      console.error("Erro ao obter ID do estudante:", error);
      console.log(
        `Usando ID padrão devido ao erro: ${ProfessionsGameService.DEFAULT_STUDENT_ID}`,
      );
      return ProfessionsGameService.DEFAULT_STUDENT_ID;
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
