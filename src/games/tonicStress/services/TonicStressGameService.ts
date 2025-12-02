import api  from "@/utils/api";

export class TonicStressGameService {
  private scene: Phaser.Scene;
  private currentLevel: number = 0;
  private score: number = 0;
  private attempts: number = 0;
  private static readonly ACTIVITY_ID = 10; // Unique ID for tonic stress game

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
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

  getScore(): number {
    return this.score;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  incrementAttempts(): void {
    this.attempts++;
  }

  getAttempts(): number {
    return this.attempts;
  }

  startQuestion(): void {
    this.attempts = 0;
  }

  calculateScore(): number {
    // Base score calculation - fewer attempts = higher score
    const baseScore = 100;
    const penalty = Math.max(0, (this.attempts - 1) * 20);
    return Math.max(20, baseScore - penalty);
  }

  getStudentId(): number {
    const user = this.scene.registry.get("user");
    return user?.id || 0;
  }

  isCorrectTonicSyllable(selectedIndex: number, correctIndex: number): boolean {
    return selectedIndex === correctIndex;
  }

  isCorrectClassification(selectedValue: string, correctValue: string): boolean {
    return selectedValue === correctValue;
  }

  async registerCorrectAnswer(studentId: number, questionId: number, answerText: string): Promise<void> {
    try {
      const payload = {
        student_id: studentId,
        activity_id: TonicStressGameService.ACTIVITY_ID,
        question_id: questionId,
        answer_text: answerText,
        is_correct: true,
        score: this.calculateScore(),
        attempts: this.attempts
      };

      await api.post("/adaptiveSystem/interaction/register", payload);
    } catch (error) {
      console.error("Error registering correct answer:", error);
      throw error;
    }
  }

  async registerIncorrectAnswer(studentId: number, questionId: number, answerText: string): Promise<void> {
    try {
      const payload = {
        student_id: studentId,
        activity_id: TonicStressGameService.ACTIVITY_ID,
        question_id: questionId,
        answer_text: answerText,
        is_correct: false,
        score: 0,
        attempts: this.attempts
      };

      await api.post("/adaptiveSystem/interaction/register", payload);
    } catch (error) {
      console.error("Error registering incorrect answer:", error);
      throw error;
    }
  }
}