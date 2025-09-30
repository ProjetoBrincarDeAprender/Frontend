import Phaser from "phaser";
import ChangeColor from "../effects/ChangeColor";
import GrowupEffect from "../effects/GrowupEffect";
import Particles from "../effects/Particles";
import FloatingEffect from "../effects/FloatingEffect";
import OverlayEffect from "../effects/OverlayEffect";

export default class EffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  changeColor(text: Phaser.GameObjects.Text, color: number): void {
    ChangeColor(this.scene, text, color);
  }

  growup(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Cubic.out",
    scale: number = 2,
    duration: number = 500,
  ): void {
    GrowupEffect(this.scene, target, ease, scale, duration);
  }

  particles(image: string): void {
    Particles(this.scene, image);
  }

  floatingElement(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Sine.easeInOut",
    y: number = 310,
  ): void {
    FloatingEffect(this.scene, target, ease, y);
  }

  overlay(overlay: number): void {
    OverlayEffect(this.scene, overlay);
  }
}
