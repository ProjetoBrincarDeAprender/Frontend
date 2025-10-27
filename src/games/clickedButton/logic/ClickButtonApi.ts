import api from "@/utils/api";

export interface ClickButtonApiConfig {
  studentId: any;
  activityId: number;
  //   questionId: number;
  answer: string;
  timeSpent: number;
  attempts: number;
  neededHint: boolean;
  //   responseDate: number;
  isCorrect: boolean;
}

export default class ClickButtonApi {
  getCurrentUser(): { id: number | string; name?: string } {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return {
          id: user.codigo_usuario_id || user.id || "usuario_publico",
          name: user.nome || user.name,
        };
      }

      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="));

      if (authToken) {
        return { id: "usuario_logado" };
      }

      return { id: "usuario_publico" };
    } catch (error) {
      console.warn("Erro ao obter usuário:", error);
      return { id: "usuario_publico" };
    }
  }

  async sendGameData(interaction: ClickButtonApiConfig): Promise<void> {
    try {
      console.log(JSON.stringify(interaction, null, 2));

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        interaction,
      );

      console.log("✅ SUCESSO! Status:", response.status);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
        };
        console.error("Status:", axiosError.response?.status);
        console.error("Status Text:", axiosError.response?.statusText);
        console.error("Response Data:", axiosError.response?.data);
      }
      console.error("Full Error:", error);
      throw error;
    }
  }
}
