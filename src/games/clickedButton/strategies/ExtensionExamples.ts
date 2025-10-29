import type { IContentRenderer } from "./IContentRenderer";
import type Button from "../logic/Button";
import type ClickedButtonLevel from "../logic/ClickButtonLevel";
import type ButtonManager from "../logic/ButtonManager";

/**
 * Exemplo de como criar uma nova estratégia de renderização.
 * Esta estratégia renderiza conteúdo em formato de vídeo.
 *
 * Para adicionar esta estratégia ao sistema:
 * ContentRendererFactory.addStrategy(new VideoContentRenderer());
 */
export class VideoContentRenderer implements IContentRenderer {
  private videoElement?: HTMLVideoElement;
  private videoControlButton?: Button;

  canRender(level: ClickedButtonLevel): boolean {
    // Verifica se o nível tem uma chave de vídeo definida
    // Você precisaria adicionar getVideoKey() ao ClickButtonLevel
    return !!(level as any).getVideoKey?.();
  }

  render(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    buttonManager: ButtonManager,
  ): Button[] | null {
    scene; // Evita aviso de variável não utilizada
    this.clear();

    const videoKey = (level as any).getVideoKey?.();
    if (!videoKey) return null;

    // Cria um elemento de vídeo HTML
    this.videoElement = document.createElement("video");
    this.videoElement.src = videoKey;
    this.videoElement.style.position = "absolute";
    this.videoElement.style.left = "200px";
    this.videoElement.style.top = "200px";
    this.videoElement.style.width = "400px";
    this.videoElement.style.height = "300px";
    this.videoElement.autoplay = true;
    this.videoElement.loop = true;

    // Adiciona o vídeo ao DOM
    document.body.appendChild(this.videoElement);

    // Cria botão de controle
    this.videoControlButton = buttonManager.createButton({
      positions: { x: 400, y: 520 },
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      text: "⏯️ Play/Pause",
      fontSize: 28,
      scale: 1.2,
    });

    // Configura evento de controle do vídeo
    this.videoControlButton.off("released");
    this.videoControlButton.on("released", () => {
      if (this.videoElement) {
        if (this.videoElement.paused) {
          this.videoElement.play();
        } else {
          this.videoElement.pause();
        }
      }
    });

    return [this.videoControlButton];
  }

  updateToComplete(
    _level: ClickedButtonLevel,
    _scene: Phaser.Scene,
    _buttonManager: ButtonManager,
  ): Button[] | null {
    // Para vídeo, pode pausar automaticamente após resposta correta
    if (this.videoElement) {
      this.videoElement.pause();
    }
    return this.videoControlButton ? [this.videoControlButton] : null;
  }

  clear(): void {
    if (this.videoElement) {
      this.videoElement.pause();
      document.body.removeChild(this.videoElement);
      this.videoElement = undefined;
    }

    this.videoControlButton?.destroy();
    this.videoControlButton = undefined;
  }
}

/**
 * Exemplo de estratégia para conteúdo interativo/animado
 */
export class AnimatedContentRenderer implements IContentRenderer {
  private animatedSprites: Phaser.GameObjects.Sprite[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];

  canRender(level: ClickedButtonLevel): boolean {
    // Verifica se o nível tem dados de animação
    return !!(level as any).getAnimationData?.();
  }

  render(
    level: ClickedButtonLevel,
    scene: Phaser.Scene,
    _buttonManager: ButtonManager,
  ): Button[] | null {
    this.clear();

    const animationData = (level as any).getAnimationData?.();
    if (!animationData) return null;

    // Cria sprites animados baseados nos dados
    animationData.sprites.forEach((spriteData: any, index: number) => {
      const sprite = scene.add.sprite(
        spriteData.x || 300 + index * 100,
        spriteData.y || 300,
        spriteData.texture,
      );

      // Adiciona animação
      sprite.play(spriteData.animation);
      this.animatedSprites.push(sprite);

      // Cria tween para cada sprite
      const tween = scene.tweens.add({
        targets: sprite,
        y: sprite.y - 50,
        duration: 1000,
        ease: "Power2",
        yoyo: true,
        repeat: -1,
      });
      this.tweens.push(tween);
    });

    return null; // Não retorna botões, apenas elementos visuais
  }

  updateToComplete(
    _level: ClickedButtonLevel,
    _scene: Phaser.Scene,
    _buttonManager: ButtonManager,
  ): Button[] | null {
    // Para todas as animações
    this.tweens.forEach((tween) => tween.pause());
    return null;
  }

  clear(): void {
    this.tweens.forEach((tween) => tween.destroy());
    this.tweens = [];

    this.animatedSprites.forEach((sprite) => sprite.destroy());
    this.animatedSprites = [];
  }
}

// Exemplo de como registrar as novas estratégias:
// import { ContentRendererFactory } from "./ContentRendererFactory";
// ContentRendererFactory.addStrategy(new VideoContentRenderer());
// ContentRendererFactory.addStrategy(new AnimatedContentRenderer());
