import Phaser from "phaser";
import EffectManager from "../../common/managers/EffectManager";
import MathLevel from "../MathLevel";
import { SumGameDataManager } from "../MathLevelManeger";

export default class MathLogic {
  private scene: Phaser.Scene;
  private levels: MathLevel[];
  private currentLevelIndex: number = 0;
  private dataManager: SumGameDataManager;
  private effectManager: EffectManager;

  constructor(
    scene: Phaser.Scene,
    levels: MathLevel[],
    userId: string = "default_user",
    activityId?: number,
    startingLevel: number = 0,
  ) {
    this.scene = scene;
    this.levels = levels;
    this.currentLevelIndex = startingLevel;
    this.dataManager = new SumGameDataManager(userId, this.scene, activityId);
    this.effectManager = new EffectManager(this.scene);

    this.startCurrentLevel();
  }

  private startCurrentLevel(): void {
    const currentLevel = this.getCurrentLevel();
    if (currentLevel) {
      this.dataManager.startLevel(
        this.currentLevelIndex + 1,
        currentLevel.getNumber1(),
        currentLevel.getNumber2(),
      );
    }
  }

  getCurrentLevel(): MathLevel | null {
    return this.levels[this.currentLevelIndex] || null;
  }

  getLevelByIndex(index: number): MathLevel | null {
    return this.levels[index] || null;
  }

  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  checkAnswer(answer: number): { correct: boolean; finished: boolean } {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return { correct: false, finished: true };

    this.dataManager.addAnswer(answer);

    const isCorrect = currentLevel.isCorrect(answer);

    if (isCorrect) {
      this.dataManager.completeLevel();

      this.currentLevelIndex++;

      if (this.currentLevelIndex >= this.levels.length) {
        this.dataManager.completeGame();
        console.log("Jogo completo! Todos os dados foram enviados por nível.");
        return { correct: true, finished: true };
      } else {
        this.startCurrentLevel();
        return { correct: true, finished: false };
      }
    }

    return { correct: false, finished: false };
  }

  getGameStats() {
    return this.dataManager.getGameData();
  }

  getCurrentLevelStats() {
    return this.dataManager.getCurrentLevelData();
  }

  successEffect(text: Phaser.GameObjects.Text) {
    this.effectManager.changeColor(text, 0x00ff00);

    this.effectManager.growup(text, "Cubic.out", 1.3, 300);

    this.createParticlesAtPosition(text.x, text.y - 50);
  }

  failEffect(text: Phaser.GameObjects.Text) {
    this.effectManager.changeColor(text, 0xff0000);

    this.effectManager.growup(text, "Bounce", 1.2, 200);
  }

  private createParticlesAtPosition(x: number, y: number) {
    this.scene.add.particles(x, y, "star", {
      duration: 200,
      lifespan: 2000,
      gravityY: 300,
      scale: { start: 0.6, end: 0 },
      speed: { min: 100, max: 200 },
      quantity: 15,
    });
  }
}
