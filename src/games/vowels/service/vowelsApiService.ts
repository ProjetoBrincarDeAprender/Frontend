import type LevelManager from "@/games/common/managers/LevelManager";
import api from "@/utils/api";
import Phaser from "phaser";
import Level from "@/games/common/models/Level";
import type GameStats from "@/games/common/managers/GameStats";

export default class VowelsApiService<T extends Level> {
  private scene: Phaser.Scene;
  private levelManager: LevelManager<T>;
  private gameStats: GameStats;

  constructor(
    scene: Phaser.Scene,
    levelManager: LevelManager<T>,
    gameStats: GameStats,
  ) {
    this.scene = scene;
    this.levelManager = levelManager;
    this.gameStats = gameStats;
  }

  async sendLevelData() {
    try {
      const levelData = {
        activityId: 3,
        questionId: this.levelManager.getCurrentIndex(),
        isCorrect: true,
        answer: this.levelManager.getCurrentLevel().getAnswer(),
        timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
        attempts: this.gameStats.getCurrentLevelMisses(),
        responseDate: this.scene.time.now,
      };

      console.log("Sending data:", levelData);

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        levelData,
        {},
      );

      if (response.status === 201) {
        console.log("Data sent successfully");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
