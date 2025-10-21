import { HousingGameData } from './HousingGameData';
import type { HousingLevel } from './HousingGameData';

export class HousingGameManager {
    private gameData: HousingGameData;
    private currentLevel: number = 0;
    private score: number = 0;
    private lives: number = 3;

    constructor() {
        this.gameData = new HousingGameData();
    }

    getCurrentLevel(): HousingLevel | undefined {
        return this.gameData.getLevel(this.currentLevel + 1);
    }

    nextLevel(): boolean {
        this.currentLevel++;
        return this.currentLevel < this.gameData.getTotalLevels();
    }

    addScore(points: number): void {
        this.score += points;
    }

    getScore(): number {
        return this.score;
    }

    loseLife(): boolean {
        this.lives--;
        return this.lives > 0;
    }

    getLives(): number {
        return this.lives;
    }

    isGameComplete(): boolean {
        return this.currentLevel >= this.gameData.getTotalLevels();
    }

    resetGame(): void {
        this.currentLevel = 0;
        this.score = 0;
        this.lives = 3;
    }

    shuffleOptions(options: string[]): string[] {
        const shuffled = [...options];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}