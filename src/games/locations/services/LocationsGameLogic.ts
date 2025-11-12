import type { LocationLevel } from '../data/LocationsGameData';

export class LocationsGameService {
  private score: number = 0;
  private currentLevel: number = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.score = 0;
    this.currentLevel = 0;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  getScore(): number {
    return this.score;
  }

  setCurrentLevel(level: number): void {
    this.currentLevel = level;
  }

  incrementLevel(): void {
    this.currentLevel++;
  }

  addScore(points: number): void {
    this.score += points;
  }

  isCorrectAnswer(selectedOption: number, level: LocationLevel): boolean {
    return selectedOption === level.correctAnswer;
  }

  calculateScore(_level: LocationLevel, timeBonus: number = 0): number {
    const baseScore = 100;
    return baseScore + timeBonus;
  }

  getProgressPercentage(totalLevels: number): number {
    return Math.round((this.currentLevel / totalLevels) * 100);
  }
}