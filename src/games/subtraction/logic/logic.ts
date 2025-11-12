import SubtractionLevel from "./MathLevel";
import { SubtractionGameDataManager } from "../SubtractionLevelManager";

export default class MathLogic {
  private levels: SubtractionLevel[];
  private currentLevelIndex: number = 0;
  private dataManager: SubtractionGameDataManager;

  constructor(
    scene: Phaser.Scene,
    levels: SubtractionLevel[],
    userId: string = "default_user",
    activityId?: number,
    startingLevel: number = 0,
  ) {
    this.levels = levels;
    this.currentLevelIndex = startingLevel;
    this.dataManager = new SubtractionGameDataManager(
      userId,
      scene,
      activityId,
    );
  }

  getCurrentLevel(): SubtractionLevel | null {
    return this.levels[this.currentLevelIndex] || null;
  }

  getLevelByIndex(index: number): SubtractionLevel | null {
    return this.levels[index] || null;
  }

  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  checkAnswer(answer: number): { correct: boolean; finished: boolean } {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return { correct: false, finished: true };

    // Registrar a resposta no data manager
    if (!this.dataManager.getCurrentLevelData()) {
      // Se não temos dados do nível atual, iniciar
      const number3 = currentLevel.isThreeNumbers()
        ? currentLevel.getNumber3()
        : undefined;
      this.dataManager.startLevel(
        this.currentLevelIndex + 1,
        currentLevel.number1,
        currentLevel.number2,
        number3,
      );
    }

    this.dataManager.addAnswer(answer);

    const isCorrect = currentLevel.isCorrect(answer);
    if (isCorrect) {
      // Completar o nível e enviar dados
      this.dataManager.completeLevel();

      this.currentLevelIndex++;
      if (this.currentLevelIndex >= this.levels.length) {
        // Jogo completo - enviar resumo final
        this.dataManager.completeGame();
        this.dataManager.sendGameData();
        return { correct: true, finished: true };
      }
      return { correct: true, finished: false };
    }

    return { correct: false, finished: false };
  }

  getDataManager(): SubtractionGameDataManager {
    return this.dataManager;
  }
}
