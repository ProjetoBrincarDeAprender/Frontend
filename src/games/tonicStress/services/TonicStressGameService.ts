import api  from "@/utils/api";

export class TonicStressGameService {
  private scene: Phaser.Scene;
  private currentLevel: number = 0;
  private score: number = 0;
  private attempts: number = 0;
  private static readonly ACTIVITY_ID = 10;

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
    return Math.max(20, 100 - Math.max(0, (this.attempts - 1) * 20));
  }

  getStudentId(): number {
    const user = this.scene.registry.get("user");
    return user?.id || 0;
  }

  isCorrectTonicSyllable = (selectedIndex: number, correctIndex: number): boolean => selectedIndex === correctIndex;
  isCorrectClassification = (selectedValue: string, correctValue: string): boolean => selectedValue === correctValue;

  private async registerAnswer(studentId: number, questionId: number, answerText: string, isCorrect: boolean): Promise<void> {
    const payload = {
      student_id: studentId,
      activity_id: TonicStressGameService.ACTIVITY_ID,
      question_id: questionId,
      answer_text: answerText,
      is_correct: isCorrect,
      score: isCorrect ? this.calculateScore() : 0,
      attempts: this.attempts
    };
    await api.post("/adaptiveSystem/interaction/register", payload);
  }

  registerCorrectAnswer = (studentId: number, questionId: number, answerText: string): Promise<void> => 
    this.registerAnswer(studentId, questionId, answerText, true);

  registerIncorrectAnswer = (studentId: number, questionId: number, answerText: string): Promise<void> => 
    this.registerAnswer(studentId, questionId, answerText, false);
}