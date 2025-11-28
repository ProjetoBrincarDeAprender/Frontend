import { ArmedSumLevel } from "./ArmedSumLevel";
import { ArmedSumDataManager } from "./ArmedSumDataManager";

export class ArmedSumLogic {
  private scene: Phaser.Scene;
  private levels: ArmedSumLevel[];
  private currentLevelIndex: number;
  private dataManager: ArmedSumDataManager;
  private currentAttempts: number = 0;

  constructor(
    scene: Phaser.Scene,
    levels: ArmedSumLevel[],
    _userId: string,
    activityId?: number,
    savedLevel: number = 0,
  ) {
    this.scene = scene;
    this.levels = levels;
    this.currentLevelIndex = savedLevel;
    this.dataManager = new ArmedSumDataManager(scene, activityId);
  }

  getCurrentLevel(): ArmedSumLevel | null {
    return this.levels[this.currentLevelIndex] || null;
  }

  getCurrentLevelNumber(): number {
    return this.currentLevelIndex + 1;
  }

  getTotalLevels(): number {
    return this.levels.length;
  }

  checkAnswer(userAnswer: string): boolean {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return false;

    // Se não iniciou o nível no data manager, iniciar agora
    if (!this.dataManager.getCurrentLevelData()) {
      this.dataManager.startLevel(
        this.currentLevelIndex + 1,
        currentLevel.getNumberA(),
        currentLevel.getNumberB(),
      );
    }

    this.currentAttempts++;
    const isCorrect = parseInt(userAnswer) === currentLevel.getAnswer();

    this.dataManager.addAnswer(userAnswer);

    if (isCorrect) {
      this.dataManager.completeLevel();
      this.currentAttempts = 0;
    }

    return isCorrect;
  }

  nextLevel(): boolean {
    this.currentLevelIndex++;
    this.scene.registry.set("armedSumCurrentLevel", this.currentLevelIndex);

    if (this.currentLevelIndex >= this.levels.length) {
      return false; // Fim do jogo
    }
    return true; // Há próximo nível
  }

  reset(): void {
    this.currentLevelIndex = 0;
    this.currentAttempts = 0;
    this.scene.registry.set("armedSumCurrentLevel", 0);
  }
}
