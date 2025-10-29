import type Button from "../logic/Button";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";

/**
 * Interface que define o contrato para estratégias de renderização de conteúdo.
 * Implementa o padrão Strategy para gerenciar diferentes tipos de conteúdo
 * (imagem + texto, apenas texto, áudio, etc.)
 */
export interface IContentRenderer {
  /**
   * Renderiza o conteúdo baseado no tipo específico da estratégia
   * @param level Nível atual do jogo
   * @param scene Cena do Phaser onde o conteúdo será renderizado
   * @param buttonManager Gerenciador de botões para criar elementos interativos
   * @returns Array de botões criados ou null se não criar botões
   */
  render(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: any,
  ): Button[] | null;

  /**
   * Limpa/remove os elementos renderizados por esta estratégia
   */
  clear(): void;

  /**
   * Atualiza o conteúdo para o estado "completo" após resposta correta
   * @param level Nível atual do jogo
   * @param scene Cena do Phaser
   * @param buttonManager Gerenciador de botões
   * @returns Array de botões atualizados ou null
   */
  updateToComplete(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: any,
  ): Button[] | null;

  /**
   * Verifica se esta estratégia pode renderizar o conteúdo do nível fornecido
   * @param level Nível do jogo a ser verificado
   * @returns true se pode renderizar, false caso contrário
   */
  canRender(level: ClickedButtonLevel): boolean;
}
