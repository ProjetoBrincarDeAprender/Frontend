import Phaser from "phaser";
import ChangeColor from "../effects/ChangeColor";
import confettiEffect from "../effects/confettiEffect";
import FloatingEffect from "../effects/FloatingEffect";
import GrowupEffect from "../effects/GrowupEffect";
import MoveEffect from "../effects/MoveEffect";
import OverlayEffect from "../effects/OverlayEffect";
import { ParallaxEffect } from "../effects/ParallaxEffect";
import Particles from "../effects/ParticlesEffect";

export default class EffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  changeColor(
    text: Phaser.GameObjects.Text,
    color: number,
    duration = 1000,
  ): void {
    ChangeColor(this.scene, text, color, duration);
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

  addParallax(
    target: Phaser.GameObjects.Image,
    y: number = 20,
    duration: number = 2000,
  ): void {
    ParallaxEffect(this.scene, target, y, duration);
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
