import type { IContentRenderer } from "./IContentRenderer";
import type Button from "../logic/Button";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";
import type ButtonManager from "../logic/ButtonManager";

/**
 * Estratégia para renderizar conteúdo de áudio.
 * Toca um áudio específico e pode exibir controles visuais se necessário.
 */
export class AudioContentRenderer implements IContentRenderer {
  private audioObject?: Phaser.Sound.BaseSound;
  private audioControlButton?: Button;

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

    // Opcionalmente, cria um botão para repetir o áudio
    this.audioControlButton = buttonManager.createButton({
      positions: { x: 400, y: 320 },
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

    return [this.audioControlButton];
  }

  updateToComplete(
    _level: ClickedButtonLevel,
    _scene: Phaser.Scene,
    _buttonManager: ButtonManager,
  ): Button[] | null {
    // Para áudio, normalmente não há mudança no estado "completo"
    // Mas você pode implementar lógica específica se necessário
    return this.audioControlButton ? [this.audioControlButton] : null;
  }

  clear(): void {
    this.audioObject?.stop();
    this.audioObject?.destroy();
    this.audioObject = undefined;

    this.audioControlButton?.destroy();
    this.audioControlButton = undefined;
  }
}
