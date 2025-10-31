import type { IContentRenderer } from "./IContentRenderer";
import type Button from "../logic/Button";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";
import type ButtonManager from "../logic/ButtonManager";

/**
 * Estratégia para renderizar apenas conteúdo textual, sem imagem.
 * Posiciona o conteúdo no centro da tela com escala maior.
 */
export class TextContentRenderer implements IContentRenderer {
  private content: Button[] = [];

  canRender(level: ClickedButtonLevel): boolean {
    return !level.getEntityKey() && !!level.getContent();
  }

  render(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
  ): Button[] | null {
    this.clear();

    const content = level.getContent();
    if (!content) return null;

    const newPositionY = 300;
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
    this.content.forEach((button) => button.destroy());
    this.content = [];

    const completeContent = level.getCompleteContent();
    if (!completeContent) return null;

    const newPositionY = 300;
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
      (content.length - 1) * spaceBetweenContent + buttonWidth * content.length;
    const startX = (scene.cameras.main.width - totalWidthOccupied) / 2 + 14;

    for (let i = 0; i < content.length; i++) {
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = buttonManager.createButton({
        positions: { x: newPositionX, y: positionY },
        textures: {
          default: "whiteButton",
        },
        text: content[i],
        fontSize: 40,
        scale: scale,
        color: "#000000",
      });
      newContent.push(contentItem);
    }

    this.content = newContent;
    return newContent;
  }
}
