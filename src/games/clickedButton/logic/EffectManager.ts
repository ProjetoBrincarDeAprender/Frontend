import Phaser from "phaser";
import ChangeColor from "@/games/common/effects/ChangeColor";
import GrowupEffect from "@/games/common/effects/GrowupEffect";
import Particles from "@/games/common/effects/ParticlesEffect";
import FloatingEffect from "@/games/common/effects/FloatingEffect";
import OverlayEffect from "@/games/common/effects/OverlayEffect";
import MoveEffect from "@/games/common/effects/MoveEffect";
import confettiEffect from "@/games/common/effects/confettiEffect";
import starEffect from "@/games/common/effects/StarEffect";
import starExplosionEffect from "@/games/common/effects/StarExplosionEffect";
import createStarParticles from "@/games/common/effects/CreateStarParticles";
import starExplosionShower from "@/games/common/effects/StarExplosionShower";
import type Button from "./Button";
/**
 * Classe EffectManager
 *
 * Gerencia e aplica efeitos visuais na cena do jogo, como animações, partículas, overlays e mudanças de cor.
 * Centraliza o uso de diferentes efeitos para facilitar o controle e reutilização.
 *
 * Principais responsabilidades:
 * - Aplicar efeitos visuais em botões, textos e outros elementos
 * - Gerenciar partículas, overlays, animações de crescimento, movimento, etc
 * - Facilitar a integração dos efeitos com a cena Phaser
 */

export default class EffectManager {
  /** Cena principal do Phaser onde os efeitos serão aplicados */
  private scene: Phaser.Scene;

  /**
   * Inicializa o gerenciador de efeitos com a cena alvo.
   * @param scene Cena Phaser
   */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Aplica um efeito de mudança de cor em um objeto de texto ou botão.
   * @param gameObject Objeto alvo
   * @param color Cor hexadecimal
   * @param duration Duração do efeito em ms (opcional)
   */
  changeColor({
    gameObject,
    color,
    duration = 1000,
  }: {
    gameObject: Phaser.GameObjects.Text | Button;
    color: number;
    duration?: number;
  }): void {
    ChangeColor(this.scene, gameObject, color, duration);
  }

  /**
   * Dispara o efeito de confete na cena.
   */
  confetti(): void {
    confettiEffect(this.scene);
  }

  /**
   * Aplica efeito de flutuação em um elemento da cena.
   * @param target Objeto alvo
   * @param ease Tipo de easing (opcional)
   * @param y Posição Y final (opcional)
   */
  floatingElement(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Sine.easeInOut",
    y: number = 310,
  ): void {
    FloatingEffect(this.scene, target, ease, y);
  }

  /**
   * Aplica efeito de crescimento/escala em um elemento.
   * @param target Objeto alvo
   * @param ease Tipo de easing (opcional)
   * @param scale Escala final (opcional)
   * @param duration Duração em ms (opcional)
   */
  growup(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Cubic.out",
    scale: number = 2,
    duration: number = 500,
  ): void {
    GrowupEffect(this.scene, target, ease, scale, duration);
  }

  /**
   * Move um ou mais elementos na cena.
   * @param targets Elemento(s) alvo
   * @param x Posição X final (opcional)
   * @param duration Duração em ms (opcional)
   * @param repeat Número de repetições (opcional)
   * @param delay Delay inicial em ms (opcional)
   */
  move<T extends Phaser.GameObjects.GameObject>(
    targets: T,
    x: number = 900,
    duration: number = 10000,
    repeat: number = -1,
    delay: number = Phaser.Math.Between(0, 5000),
  ): void {
    MoveEffect(this.scene, targets, x, duration, repeat, delay);
  }

  /**
   * Aplica um overlay visual na cena.
   * @param overlay Valor de opacidade/cor
   */
  overlay(overlay: number): void {
    OverlayEffect(this.scene, overlay);
  }

  /**
   * Dispara partículas usando uma imagem específica.
   * @param image Caminho ou chave da imagem
   */
  particles(image: string): void {
    Particles(this.scene, image);
  }

  /**
   * Dispara efeito de estrela na posição indicada.
   * @param x Posição X
   * @param y Posição Y
   */
  starEffect(x: number, y: number): void {
    starEffect(this.scene, x, y);
  }

  /**
   * Dispara efeito de explosão de estrelas na posição indicada.
   * @param x Posição X
   * @param y Posição Y
   */
  starExplosion(x: number, y: number): void {
    starExplosionEffect(this.scene, x, y);
  }

  /**
   * Cria partículas de estrela na posição indicada.
   * @param x Posição X
   * @param y Posição Y
   */
  starParticles(x: number, y: number): void {
    createStarParticles(this.scene, x, y);
  }

  /**
   * Dispara efeito de "chuva" de explosão de estrelas na posição central.
   */
  starExplosionShower() {
    starExplosionShower(this.scene, 400, 240);
  }
}
