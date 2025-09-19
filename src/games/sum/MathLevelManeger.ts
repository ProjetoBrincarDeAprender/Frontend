import MathLevel from "./MathLevel";
import type { SumGameSession, SumLevelData } from './SumGameData';
import api from '@/utils/api';

interface UserInteraction {
  aluno_id?: number; // Mudança: usar o nome correto do campo no banco
  atividade_id?: number; // Mudança: usar o nome correto do campo no banco
  questao_id?: number; // Mudança: usar o nome correto do campo no banco
  resposta: string; // Mudança: usar o nome correto do campo no banco
  esta_correta: boolean; // Mudança: usar o nome correto do campo no banco
  tempo_resposta: number; // Mudança: usar o nome correto do campo no banco (em segundos)
  numero_tentativas: number; // Mudança: usar o nome correto do campo no banco
  usou_ajuda?: boolean; // Mudança: usar o nome correto do campo no banco
  data_resposta: Date; // Mudança: usar o nome correto do campo no banco
}

export default class MathLevelManager {
  private levels: MathLevel[];
  private currentIndex: number;

  constructor(levels: MathLevel[]) {
    this.levels = levels;
    this.currentIndex = 0;
  }

  getCurrentLevel(): MathLevel {
    return this.levels[this.currentIndex];
  }

  nextLevel(): boolean {
    if (this.currentIndex < this.levels.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  isFinished(): boolean {
    return this.currentIndex >= this.levels.length - 1;
  }
}


export class SumGameDataManager {
  private gameSession: SumGameSession;
  private currentLevelData: SumLevelData | null = null;
  private activityId: number = 1; // ID padrão, pode ser configurado

  constructor(userId: string, activityId?: number) {
    this.gameSession = {
      gameId: this.generateGameId(),
      userId,
      startTime: Date.now(),
      totalTime: 0,
      levelsData: [],
      totalWrongAnswers: 0,
      levelsCompleted: 0,
      gameCompleted: false
    };
    
    if (activityId) {
      this.activityId = activityId;
    }
  }

  private generateGameId(): string {
    return `sum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startLevel(levelNumber: number, number1: number, number2: number): void {
    this.currentLevelData = {
      level: levelNumber,
      number1,
      number2,
      correctAnswer: number1 + number2,
      userAnswers: [],
      wrongAnswers: 0,
      timeSpent: 0,
      startTime: Date.now(),
      completed: false
    };
  }

  addAnswer(answer: number): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.userAnswers.push(answer);

    if (answer !== this.currentLevelData.correctAnswer) {
      this.currentLevelData.wrongAnswers++;
      this.gameSession.totalWrongAnswers++;
    }
  }

  completeLevel(): void {
    if (!this.currentLevelData) return;

    this.currentLevelData.endTime = Date.now();
    this.currentLevelData.timeSpent = (this.currentLevelData.endTime - this.currentLevelData.startTime) / 1000;
    this.currentLevelData.completed = true;

    this.gameSession.levelsData.push(this.currentLevelData);
    this.gameSession.levelsCompleted++;
    
    this.currentLevelData = null;
  }

  completeGame(): void {
    this.gameSession.endTime = Date.now();
    this.gameSession.totalTime = (this.gameSession.endTime - this.gameSession.startTime) / 1000;
    this.gameSession.gameCompleted = true;
  }

  getGameData(): SumGameSession {
    return { ...this.gameSession };
  }

  getCurrentLevelData(): SumLevelData | null {
    return this.currentLevelData;
  }

  getInteractionsSummary(): { totalInteractions: number; levelsCompleted: number; totalAnswers: number } {
    return {
      totalInteractions: 1,
      levelsCompleted: this.gameSession.levelsCompleted,
      totalAnswers: this.gameSession.levelsData.reduce((total, level) => total + level.userAnswers.length, 0)
    };
  }

  async sendGameData(): Promise<void> {
    try {
      const gameInteraction = this.createGameSummaryInteraction();
      
      // console.log('Dados mapeados para o banco:');
      // console.log(JSON.stringify(gameInteraction, null, 2));
      
      await api.post('/adaptiveSystem/interaction/register', gameInteraction);
      
      console.log('Dados salvos com sucesso');
    } catch (error) {
      console.error(' Erro ao enviar dados do jogo:', error);
      throw error;
    }
  }

  private createGameSummaryInteraction(): UserInteraction {
    const totalCorrectAnswers = this.gameSession.levelsData.filter(level => 
      level.userAnswers[level.userAnswers.length - 1] === level.correctAnswer
    ).length;
    
    const totalWrongAnswers = this.gameSession.totalWrongAnswers;
    const totalTime = this.gameSession.totalTime;
    
    const gameResult = {
      levelsCompleted: this.gameSession.levelsCompleted,
      correctAnswers: totalCorrectAnswers,
      wrongAnswers: totalWrongAnswers,
      totalTime: Math.round(totalTime),
      accuracy: totalCorrectAnswers / this.gameSession.levelsCompleted
    };

    return {
      aluno_id: parseInt(this.gameSession.userId), 
      atividade_id: this.activityId,
      questao_id: 1, 
      resposta: JSON.stringify(gameResult), 
      esta_correta: totalCorrectAnswers === this.gameSession.levelsCompleted, 
      tempo_resposta: Math.round(totalTime), 
      numero_tentativas: 1, 
      usou_ajuda: false,
      data_resposta: new Date()
    };
  }

  // Método para debug - mostra um resumo do que será enviado
  getInteractionSummary(): { 
    studentId: string, 
    activityId: number, 
    levelsCompleted: number, 
    totalWrongAnswers: number,
    totalTime: number,
    willSendAsCorrect: boolean 
  } {
    const totalCorrectAnswers = this.gameSession.levelsData.filter(level => 
      level.userAnswers[level.userAnswers.length - 1] === level.correctAnswer
    ).length;
    
    return {
      studentId: this.gameSession.userId,
      activityId: this.activityId,
      levelsCompleted: this.gameSession.levelsCompleted,
      totalWrongAnswers: this.gameSession.totalWrongAnswers,
      totalTime: this.gameSession.totalTime,
      willSendAsCorrect: totalCorrectAnswers === this.gameSession.levelsCompleted
    };
  }
}
