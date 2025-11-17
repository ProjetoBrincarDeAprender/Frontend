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
  private imageObject?: Phaser.GameObjects.Image;
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

    const entityKey = level.getEntityKey();

    let audioX = 400;
    let audioY = 240;

    if (entityKey) {
      audioX = 300; // Ajusta a posição X se houver uma imagem ao lado
    }

    // Toca o áudio automaticamente
    this.audioObject = scene.sound.add(audioKey);
    this.audioObject.play();

    // Cria um botão para repetir o áudio
    this.audioControlButton = buttonManager.createButton({
      positions: { x: audioX, y: audioY }, // Posição similar à imagem na ImageContentRenderer
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

    // Renderiza a imagem do lado
    this.imageObject?.destroy();
    if (entityKey) {
      const entityX = audioX + 150;
      const entityY = audioY;
      this.imageObject = scene.add
        .image(entityX, entityY, entityKey)
        .setOrigin(0.5, 0.5)
        .setScale(0.9);
    }

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
    const buttonInfos = this.calculateButtonInfos(content, scene, scale);
    const totalWidthOccupied = this.calculateTotalWidth(buttonInfos);
    const startX = (scene.cameras.main.width - totalWidthOccupied) / 2;
    let currentX = startX;

    for (let i = 0; i < content.length; i++) {
      const buttonInfo = buttonInfos[i];
      const buttonCenterX = currentX + buttonInfo.width / 2;
      const contentItem = buttonManager.createButton({
        positions: { x: buttonCenterX, y: positionY },
        textures: {
          default: buttonInfo.textureKey,
        },
        color: "#000000",
        text: content[i],
        fontSize: buttonInfo.fontSize,
        scale: scale,
      });

      newContent.push(contentItem);
      currentX += buttonInfo.width + buttonInfo.spacing;
    }

    return newContent;
  }

  /**
   * Calcula as informações necessárias para cada botão (textura, largura, espaçamento)
   */
  private calculateButtonInfos(
    content: string[],
    scene: Phaser.Scene,
    scale: number,
  ) {
    return content.map((text, index) => {
      const textureKey =
        text.length >= 4 ? "whiteRectangleButton" : "whiteButton";

      const texture = scene.textures.get(textureKey);
      const width = texture.source[0].width * scale;
      const spacing =
        index === content.length - 1 ? 0 : text.length >= 4 ? 10 : 60;
      const fontSize = text.length >= 4 ? 32 - text.length * 0.8 : 32;

      return {
        textureKey,
        width,
        spacing,
        text,
        fontSize,
      };
    });
  }

  /**
   * Calcula a largura total que será ocupada por todos os botões
   */
  private calculateTotalWidth(
    buttonInfos: Array<{ width: number; spacing: number }>,
  ) {
    return buttonInfos.reduce((total, buttonInfo) => {
      return total + buttonInfo.width + buttonInfo.spacing;
    }, 0);
  }
}
