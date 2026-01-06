import type { User } from "@/types/user";
import api from "@/utils/api";
import { AxiosError } from "axios";
import Phaser from "phaser";

export class APIDataService {
  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private getUser(): User | undefined {
    return this.scene.registry.get("userData");
  }

  async sendGameData(
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
    const userPayload = this.getUser();

    console.log("=== DEBUG API ===");
    console.log("userPayload:", userPayload);

    if (userPayload === undefined) {
      console.error("Dados do usuário não encontrados na cena.");
      return;
    }

    if (userPayload?.perfil != "Aluno") {
      console.log("Usuário não é aluno, não enviando dados");
      return;
    }

    try {
      const payload = {
        studentId: Number(userPayload.codigo_usuario || 10130001),
        activityId: activityId,
        questionId: questionId,
        attempts: gameStats.attempts,
        timeSpent: gameStats.timeSpent,
        isCorrect: gameStats.isCorrect,
        answer: gameStats.answer,
        neededHint: gameStats.neededHint,
      };

      console.log("Payload completo:", JSON.stringify(payload, null, 2));
      console.log("URL:", "/adaptiveSystem/interaction/register");

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        payload,
      );

      // Log do código HTTP sempre que houver resposta
      console.log("HTTP status code:", response.status);

      if (response.status === 201) {
        console.log("Dados enviados com sucesso");
        console.log("Resposta do servidor:", response.data);
      }

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Erro ao enviar dados | HTTP status code:",
          error.response?.status,
          error.message,
        );
        console.error("Detalhes do erro:", error.response?.data);
      }
      if (error instanceof Error) {
        console.error("Erro durante processamento:", error.message);
      }

      throw error;
    }
  }
}
