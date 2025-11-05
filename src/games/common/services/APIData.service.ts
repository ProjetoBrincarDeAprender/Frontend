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

    console.log(userPayload);

    if (userPayload === undefined) {
      console.error("Dados do usuário não encontrados na cena.");
      return;
    }

    if (userPayload?.perfil != "Aluno") {
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
