import type { IContentRenderer } from "./IContentRenderer";
import type Button from "../logic/Button";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";
import type ButtonManager from "../logic/ButtonManager";

/**
 * Estratégia para renderizar conteúdo quando há uma entidade/imagem no nível.
 * Posiciona o conteúdo textual abaixo da imagem com escala reduzida.
 */
export class ImageContentRenderer implements IContentRenderer {
  private entity?: Phaser.GameObjects.Image;
  private content: Button[] = [];

  canRender(level: ClickedButtonLevel): boolean {
    return !!level.getEntityKey() && !!level.getContent();
  }

  render(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
  ): Button[] | null {
    this.clear();

    // Renderiza a entidade/imagem
    const entityKey = level.getEntityKey();
    if (entityKey) {
      this.entity = scene.add
        .image(400, 240, entityKey)
        .setOrigin(0.5, 0.5)
        .setScale(0.3);
    }

    // Renderiza o conteúdo textual
    const content = level.getContent();
    if (!content) return null;

    const newPositionY = 380;
    const scale = 1.2;

    return this.createContentButtons(
      content,
      scene,
      buttonManager,
      newPositionY,
      scale,
    );
  }

  updateToComplete(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
  ): Button[] | null {
    // Remove apenas os botões de conteúdo, mantém a entidade
    this.content.forEach((button) => button.destroy());
    this.content = [];

    const completeContent = level.getCompleteContent();
    if (!completeContent) return null;

    const newPositionY = 380;
    const scale = 1.2;

    return this.createContentButtons(
      completeContent,
      scene,
      buttonManager,
      newPositionY,
      scale,
    );
  }

  clear(): void {
    this.entity?.destroy();
    this.entity = undefined;
    this.content.forEach((button) => button.destroy());
    this.content = [];
  }

  private createContentButtons(
    content: string[],
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
    positionY: number,
    scale: number,
  ): Button[] {
    const newContent: Button[] = [];
    const spaceBetweenContent = 60;
    const buttonWidth = 20 * scale;
    const totalWidthOccupied =
      (content.length - 1) * spaceBetweenContent +
      buttonWidth * content.length -
      20;
    const startX = (scene.cameras.main.width - totalWidthOccupied) / 2;

    for (let i = 0; i < content.length; i++) {
      const dynamicFontSize = this.calculateFontSize(content[i], scale);
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = buttonManager.createButton({
        positions: { x: newPositionX, y: positionY },
        textures: {
          default: "whiteButton",
        },
        text: content[i],
        fontSize: dynamicFontSize,
        scale: scale,
        color: "#000000",
      });
      newContent.push(contentItem);
    }

    this.content = newContent;
    return newContent;
  }

  private calculateFontSize(
    text: string,
    buttonScale: number = 1.0,
    baseSize: number = 30,
    minSize: number = 16,
    maxSize: number = 40,
  ): number {
    if (!text || text.trim().length === 0) {
      return baseSize;
    }

    const textLength = text.trim().length;
    let fontSize = baseSize;

    // Ajusta fontSize baseado no comprimento do texto
    if (textLength <= 1) {
      fontSize = maxSize;
    } else if (textLength <= 2) {
      fontSize = baseSize * 0.9;
    } else if (textLength <= 3) {
      fontSize = baseSize * 0.65;
    } else {
      fontSize = baseSize * 0.5;
    }

    // Ajusta para a escala do botão
    fontSize *= buttonScale;

    // Garante que está dentro dos limites
    return Math.max(minSize, Math.min(maxSize, Math.round(fontSize)));
  }
}
