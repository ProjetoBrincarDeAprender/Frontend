import api from "@/utils/api";
import { AxiosError } from "axios";

export class APIDataService {
  constructor() {
    // Inicialização do serviço, se necessário
  }

  async sendGameData(
    userId: string,
    activityId: number,
    questionId: number,
    gameStats: {
      attempts: number;
      timeSpent: number;
      isCorrect: boolean;
      answer: string;
      neededHint: boolean;
    },
  ) {
    try {
      const payload = {
        studentId: Number(userId),
        activityId: activityId,
        questionId: questionId,
        attempts: gameStats.attempts,
        timeSpent: gameStats.timeSpent,
        isCorrect: gameStats.isCorrect,
        answer: gameStats.answer,
        neededHint: gameStats.neededHint,
      };

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        payload,
      );

      if (response.status === 201) {
        console.log("Dados enviados com sucesso");
        console.log("Resposta do servidor:", response.data);
      }

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Erro ao enviar dados:",
          error.response?.status,
          error.message,
        );
      }
      if (error instanceof Error) {
        console.error("Erro durante processamento:", error.message);
      }

      throw error;
    }
  }
}
