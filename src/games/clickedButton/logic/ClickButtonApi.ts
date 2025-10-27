import api from "@/utils/api";

export interface ClickButtonApiConfig {
  activityId: number | string;
  level: number;
  content: string[];
  answer: string;
  userAnswer: string;
  timeSpent: number;
}

export default class ClickButtonApi {
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
