import type GameStats from "@/games/common/managers/GameStats";
import type LevelManager from "@/games/common/managers/LevelManager";
import Phaser from "phaser";
import type SpaceLevel from "../logic/SpaceLevel";

export default class SpaceApiService {
  private scene: Phaser.Scene;
  private levelManager: LevelManager<SpaceLevel>;
  private gameStats: GameStats;

  constructor(
    scene: Phaser.Scene,
    levelManager: LevelManager<SpaceLevel>,
    gameStats: GameStats,
  ) {
    this.scene = scene;
    this.levelManager = levelManager;
    this.gameStats = gameStats;
  }

  async sendLevelData() {
    try {
      // const levelData = {
      //   activityId: 4, // ID específico para o jogo do espaço
      //   questionId: this.levelManager.getCurrentIndex(),
      //   isCorrect: true,
      //   answer: this.levelManager.getCurrentLevel().getAnswer(),
      //   timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
      //   attempts: this.gameStats.getCurrentLevelMisses(),
      //   responseDate: this.scene.time.now,
      //   difficulty: this.levelManager.getCurrentLevel().getDifficulty(),
      //   question: this.levelManager.getCurrentLevel().getQuestion(),
      //   hasImages: this.levelManager.getCurrentLevel().hasImages(),
      // };
      // console.log("Sending space game data:", levelData);
      // const response = await api.post(
      //   "/adaptiveSystem/interaction/register",
      //   levelData,
      //   {},
      // );
      // if (response.status === 201) {
      //   console.log("Space game data sent successfully");
      //   console.log(response);
      // }
    } catch (error) {
      console.log("Error sending space game data:", error);
    }
  }

  async sendGameCompletionData() {
    try {
      // const totalLevels = this.getTotalLevels();
      // const totalTimeSpent = this.getTotalTimeSpent();
      // const totalMisses = this.getTotalMisses();
      // const completionData = {
      //   activityId: 4,
      //   totalQuestions: totalLevels,
      //   correctAnswers: totalLevels,
      //   totalTimeSpent: totalTimeSpent,
      //   totalAttempts: totalMisses,
      //   completionDate: this.scene.time.now,
      //   gameCompleted: true,
      // };
      // console.log("Sending space game completion data:", completionData);
      // const response = await api.post(
      //   "/adaptiveSystem/game/completion",
      //   completionData,
      //   {},
      // );
      // if (response.status === 201) {
      //   console.log("Space game completion data sent successfully");
      //   console.log(response);
      // }
    } catch (error) {
      console.log("Error sending space game completion data:", error);
    }
  }

  private getTotalLevels(): number {
    // Calculamos baseado no índice atual que é o último nível completado
    return this.levelManager.getCurrentIndex() + 1;
  }

  private getTotalTimeSpent(): number {
    // Somar todos os tempos dos níveis concluídos
    return this.gameStats.hitTimes.reduce((total, time) => total + time, 0);
  }

  private getTotalMisses(): number {
    // Somar todos os erros dos níveis + erros do nível atual
    const previousMisses = this.gameStats.missCounts.reduce(
      (total, misses) => total + misses,
      0,
    );
    return previousMisses + this.gameStats.getCurrentLevelMisses();
  }
}
