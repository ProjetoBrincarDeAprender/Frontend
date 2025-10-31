import type { IContentRenderer } from "./IContentRenderer";
import type Button from "../logic/Button";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";
import type ButtonManager from "../logic/ButtonManager";

/**
 * Estratégia para renderizar conteúdo de áudio.
 * Toca um áudio específico, exibe controles visuais e pode renderizar
 * conteúdo textual abaixo do botão de áudio, similar à ImageContentRenderer.
 */
export class AudioContentRenderer implements IContentRenderer {
  private audioObject?: Phaser.Sound.BaseSound;
  private audioControlButton?: Button;
  private content: Button[] = [];

  canRender(level: ClickedButtonLevel): boolean {
    // Verifica se o nível tem uma chave de áudio definida
    return !!level.getAudioKey();
  }

  render(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
  ): Button[] | null {
    this.clear();

    const audioKey = level.getAudioKey();
    if (!audioKey) return null;

    // Toca o áudio automaticamente
    this.audioObject = scene.sound.add(audioKey);
    this.audioObject.play();

    // Cria um botão para repetir o áudio
    this.audioControlButton = buttonManager.createButton({
      positions: { x: 400, y: 240 }, // Posição similar à imagem na ImageContentRenderer
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      text: "🔊",
      fontSize: 32,
      scale: 1.0,
    });

    // Configura o evento de clique para repetir o áudio
    this.audioControlButton.off("released");
    this.audioControlButton.on("released", () => {
      if (this.audioObject) {
        this.audioObject.stop();
        this.audioObject.play();
      }
    });

    // Renderiza o conteúdo textual abaixo do botão de áudio, se existir
    const contentArray = level.getContent();
    if (contentArray && contentArray.length > 0) {
      const newPositionY = 380; // Mesma posição Y usada na ImageContentRenderer
      const scale = 1.2; // Mesma escala usada na ImageContentRenderer

      const contentButtons = this.createContentButtons(
        contentArray,
        scene,
        buttonManager,
        newPositionY,
        scale,
      );
      this.content = contentButtons;
    }

    // Retorna todos os botões criados (botão de áudio + conteúdo)
    const allButtons = [this.audioControlButton];
    if (this.content.length > 0) {
      allButtons.push(...this.content);
    }

    return allButtons;
  }

  updateToComplete(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
  ): Button[] | null {
    // Remove apenas os botões de conteúdo, mantém o botão de áudio
    this.content.forEach((button) => button.destroy());
    this.content = [];

    const completeContent = level.getCompleteContent();
    if (completeContent && completeContent.length > 0) {
      const newPositionY = 380;
      const scale = 1.2;

      const contentButtons = this.createContentButtons(
        completeContent,
        scene,
        buttonManager,
        newPositionY,
        scale,
      );
      this.content = contentButtons;
    }

    // Retorna todos os botões (botão de áudio + conteúdo atualizado)
    const allButtons = this.audioControlButton ? [this.audioControlButton] : [];
    if (this.content.length > 0) {
      allButtons.push(...this.content);
    }

    return allButtons.length > 0 ? allButtons : null;
  }

  clear(): void {
    this.audioObject?.stop();
    this.audioObject?.destroy();
    this.audioObject = undefined;

    this.audioControlButton?.destroy();
    this.audioControlButton = undefined;

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
    const startX = (scene.cameras.main.width - totalWidthOccupied) / 2 + 15;

    for (let i = 0; i < content.length; i++) {
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = buttonManager.createButton({
        positions: { x: newPositionX, y: positionY },
        textures: {
          default: "whiteButton",
        },
        color: "#000000",
        text: content[i],
        fontSize: 40,
        scale: scale,
      });
      newContent.push(contentItem);
    }

    return newContent;
  }
}
