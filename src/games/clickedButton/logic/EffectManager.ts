import Phaser from "phaser";
import ChangeColor from "@/games/common/effects/ChangeColor";
import GrowupEffect from "@/games/common/effects/GrowupEffect";
import Particles from "@/games/common/effects/ParticlesEffect";
import FloatingEffect from "@/games/common/effects/FloatingEffect";
import OverlayEffect from "@/games/common/effects/OverlayEffect";
import MoveEffect from "@/games/common/effects/MoveEffect";
import confettiEffect from "@/games/common/effects/confettiEffect";

export default class EffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  changeColor(text: Phaser.GameObjects.Text, color: number): void {
    ChangeColor(this.scene, text, color);
  }

  confetti(): void {
    confettiEffect(this.scene);
  }

  floatingElement(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Sine.easeInOut",
    y: number = 310,
  ): void {
    FloatingEffect(this.scene, target, ease, y);
  }

  growup(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Cubic.out",
    scale: number = 2,
    duration: number = 500,
  ): void {
    GrowupEffect(this.scene, target, ease, scale, duration);
  }

  move<T extends Phaser.GameObjects.GameObject>(
    targets: T,
    x: number = 900,
    duration: number = 10000,
    repeat: number = -1,
    delay: number = Phaser.Math.Between(0, 5000),
  ): void {
    MoveEffect(this.scene, targets, x, duration, repeat, delay);
  }

  overlay(overlay: number): void {
    OverlayEffect(this.scene, overlay);
  }

  particles(image: string): void {
    Particles(this.scene, image);
  }
}
