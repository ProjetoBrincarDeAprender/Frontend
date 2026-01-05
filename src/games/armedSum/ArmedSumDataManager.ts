import { APIDataService } from "../common/services/APIData.service";

interface ArmedSumLevelData {
  level: number;
  numberA: number;
  numberB: number;
  correctAnswer: number;
  userAnswers: string[];
  wrongAnswers: number;
  timeSpent: number;
  completed: boolean;
  startTime: number;
  endTime?: number;
}

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
    return { id: 10130001 };
  } catch (error) {
    return { id: 10130001 };
  }
}

export class ArmedSumDataManager {
  private currentLevelData: ArmedSumLevelData | null = null;
  private activityId: number = 60; // ID da atividade do jogo de conta armada
  private apiService: APIDataService;
  private levelsCompleted: number = 0;
  // Mapeamento de questionIds por nível (índice 0 = nível 1, índice 1 = nível 2, etc.)
  private readonly levelQuestionIds = [
    235, // Nível 1
    236, // Nível 2
    237, // Nível 3
    238, // Nível 4
    239, // Nível 5
    240, // Nível 6
    241, // Nível 7
    242, // Nível 8
    243, // Nível 9
    244, // Nível 10
    245, // Nível 11
    246, // Nível 12
    247, // Nível 13
    248, // Nível 14
    249, // Nível 15
  ];

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
      userAnswers: [],
      wrongAnswers: 0,
      timeSpent: 0,
      completed: false,
      startTime: Date.now(),
    };
  }

  addAnswer(answer: string): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.userAnswers.push(answer);

    if (parseInt(answer) !== this.currentLevelData.correctAnswer) {
      this.currentLevelData.wrongAnswers++;
    }
  }

  completeLevel(): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.endTime = Date.now();
    this.currentLevelData.timeSpent =
      (this.currentLevelData.endTime - this.currentLevelData.startTime) / 1000;
    this.currentLevelData.completed = true;
    this.levelsCompleted++;

    this.sendLevelData(this.currentLevelData);
    this.currentLevelData = null;
  }

  async sendLevelData(levelData: ArmedSumLevelData): Promise<void> {
    try {
      const user = getCurrentUser();
      const levelInteraction = this.createLevelInteraction(levelData, user);

      console.log("🎮 DADOS DO NÍVEL - CONTA ARMADA:");
      console.log(JSON.stringify(levelInteraction, null, 2));

      const response = await this.apiService.sendGameData(
        levelInteraction.activityId,
        levelInteraction.questionId,
        levelInteraction,
      );

      console.log("✅ Resposta do servidor:", response?.data);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
        };
        console.error("❌ Status do erro:", axiosError.response?.status);
        console.error("❌ Dados do erro:", axiosError.response?.data);
      }
      console.error("❌ Erro completo:", error);
    }
  }

  private createLevelInteraction(
    levelData: ArmedSumLevelData,
    user: { id: number | string; name?: string },
  ): UserInteraction {
    const isCorrect =
      levelData.userAnswers.length > 0 &&
      parseInt(levelData.userAnswers[levelData.userAnswers.length - 1]) ===
        levelData.correctAnswer;

    const operation = `${levelData.numberA} + ${levelData.numberB}`;

    const levelResult = {
      levelNumber: levelData.level,
      operation,
      correctAnswer: levelData.correctAnswer,
      userAnswers: levelData.userAnswers,
      isCorrect: isCorrect,
      wrongAnswers: levelData.wrongAnswers,
      timeSpent: Math.round(levelData.timeSpent),
      userId: user.id || 10130001,
      userName: user.name || "Usuário Anônimo",
    };

    // Obtém o questionId do mapeamento (levelData.level começa em 1, então subtraímos 1 para o índice)
    const questionId =
      this.levelQuestionIds[levelData.level - 1] || levelData.level;

    return {
      studentId:
        typeof user.id === "number"
          ? user.id
          : parseInt(user.id.toString()) || 10130001,
      activityId: this.activityId,
      questionId: questionId,
      answer: JSON.stringify(levelResult),
      timeSpent: Math.round(levelData.timeSpent * 1000),
      attempts: levelData.userAnswers.length,
      neededHint: false,
      responseDate: new Date().toISOString(),
      isCorrect: isCorrect,
    };
  }

  getCurrentLevelData(): ArmedSumLevelData | null {
    return this.currentLevelData;
  }
}
