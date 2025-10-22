import ClickButtonLevel from "./ClickButtonLevel";

/**
 * Classe LevelManager
 *
 * Gerencia o progresso e navegação entre os níveis do jogo de clicar em botões.
 * Permite acessar o nível atual, avançar, reiniciar e verificar se o jogo terminou.
 *
 * Principais responsabilidades:
 * - Armazenar os níveis do jogo
 * - Controlar o índice do nível atual
 * - Fornecer métodos para navegação e controle do fluxo dos níveis
 */

export default class LevelManager {
  /** Array de níveis do jogo */
  private levels: ClickButtonLevel[];
  /** Índice do nível atual */
  private actualIndex: number;

  /**
   * Inicializa o gerenciador de níveis com o array de níveis.
   * @param levels Array de instâncias de ClickButtonLevel
   */
  constructor(levels: ClickButtonLevel[]) {
    this.levels = levels;
    this.actualIndex = 0;
  }

  /**
   * Retorna o array de níveis do jogo.
   */
  public getLevels(): ClickButtonLevel[] {
    return this.levels;
  }

  /**
   * Retorna o nível atual.
   */
  public getActualLevel(): ClickButtonLevel {
    return this.levels[this.actualIndex];
  }

  /**
   * Retorna o índice do nível atual.
   */
  public getActualIndex(): number {
    return this.actualIndex;
  }

  /**
   * Avança para o próximo nível.
   * @returns true se ainda há níveis restantes, false se terminou
   */
  public nextLevel(): boolean {
    this.actualIndex++;
    if (this.actualIndex < this.levels.length) return true;
    return false;
  }

  /**
   * Verifica se todos os níveis foram concluídos.
   */
  public isFinished(): boolean {
    if (this.actualIndex >= this.levels.length) return true;
    return false;
  }

  /**
   * Reinicia o progresso, voltando ao primeiro nível.
   */
  public reset(): void {
    this.actualIndex = 0;
  }
}
