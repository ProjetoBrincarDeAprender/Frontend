import type { IContentRenderer } from "./IContentRenderer";
import { ImageContentRenderer } from "./ImageContentRenderer";
import { TextContentRenderer } from "./TextContentRenderer";
import { AudioContentRenderer } from "./AudioContentRenderer";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";

/**
 * Factory responsável por determinar qual estratégia de renderização usar
 * baseado no tipo de conteúdo do nível.
 *
 * Implementa o padrão Strategy + Factory Method para fornecer a estratégia adequada.
 */
export class ContentRendererFactory {
  private static strategies: IContentRenderer[] = [
    new AudioContentRenderer(), // Prioridade alta - verifica primeiro se tem áudio
    new ImageContentRenderer(), // Prioridade média - verifica se tem imagem + conteúdo
    new TextContentRenderer(), // Prioridade baixa - fallback para apenas texto
  ];

  /**
   * Retorna a estratégia apropriada para renderizar o conteúdo do nível.
   * @param level Nível do jogo para determinar a estratégia
   * @returns Estratégia de renderização apropriada ou null se nenhuma for aplicável
   */
  public static getRenderer(
    level: ClickedButtonLevel,
  ): IContentRenderer | null {
    for (const strategy of this.strategies) {
      if (strategy.canRender(level)) {
        return strategy;
      }
    }
    return null;
  }

  /**
   * Adiciona uma nova estratégia de renderização à lista.
   * @param strategy Nova estratégia a ser adicionada
   */
  public static addStrategy(strategy: IContentRenderer): void {
    this.strategies.unshift(strategy); // Adiciona no início para ter prioridade alta
  }

  /**
   * Remove uma estratégia específica da lista.
   * @param strategyType Tipo da estratégia a ser removida
   */
  public static removeStrategy(strategyType: new () => IContentRenderer): void {
    this.strategies = this.strategies.filter(
      (strategy) => !(strategy instanceof strategyType),
    );
  }
}
