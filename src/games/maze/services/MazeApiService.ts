import type { User } from "@/types/user";
import api from "@/utils/api";
import { AxiosError } from "axios";
import Phaser from "phaser";

export interface MazeGameData {
  questionId: number;
  attempts: number;
  timeSpent: number;
  isCorrect: boolean;
  neededHint: boolean;
}

export class MazeApiService {
  private scene: Phaser.Scene;
  private activityId: number;

  constructor(scene: Phaser.Scene, activityId?: number) {
    this.scene = scene;
    // ATENÇÃO: Configure o ID correto da atividade do labirinto no banco de dados
    // Para descobrir o ID: SELECT id, titulo FROM atividade WHERE titulo LIKE '%labirinto%';
    this.activityId = activityId || 0; // 0 = não configurado, não enviará dados
  }

  private getUser(): User | undefined {
    return this.scene.registry.get("userData");
  }

  async sendGameData(gameData: MazeGameData) {
    const userPayload = this.getUser();

    if (userPayload === undefined) {
      console.error("Dados do usuário não encontrados na cena.");
      return;
    }

    if (userPayload?.perfil !== "Aluno") {
      console.log("Envio de dados ignorado: usuário não é aluno");
      return;
    }

    if (this.activityId === 0) {
      console.warn(
        "⚠️ ActivityId não configurado. Configure o ID correto da atividade no banco de dados.",
      );
      return;
    }

    try {
      const payload = {
        studentId: Number(userPayload.codigo_usuario || 10130001),
        activityId: this.activityId,
        questionId: gameData.questionId,
        attempts: gameData.attempts,
        timeSpent: gameData.timeSpent,
        isCorrect: gameData.isCorrect,
        answer: "completed", // Backend não aceita string vazia
        neededHint: gameData.neededHint,
      };

      console.log("📤 Enviando dados do jogo do labirinto:", payload);

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        payload,
      );

      console.log("✅ Resposta do servidor (HTTP " + response.status + "):", {
        status: response.status,
        data: response.data,
      });

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "❌ Erro ao enviar dados (HTTP " + error.response?.status + "):",
          error.message,
        );
        console.error("📋 Detalhes do erro do backend:", error.response?.data);
      }
      if (error instanceof Error) {
        console.error("❌ Erro durante processamento:", error.message);
      }

      throw error;
    }
  }
}
