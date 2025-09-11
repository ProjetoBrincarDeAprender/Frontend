import Phaser from "phaser";
import ChangeColor from "../effects/ChangeColor";
import GrowupEffect from "../effects/GrowupEffect";
import Particles from "../effects/Particles";

export default class EffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  changeColor(text: Phaser.GameObjects.Text, color: number) {
    ChangeColor(this.scene, text, color);
  }

  growup(
    target: Phaser.GameObjects.GameObject,
    ease: string = "Cubic.out",
    scale: number = 2,
    duration: number = 500,
  ) {
    GrowupEffect(this.scene, target, ease, scale, duration);
  }

  particles(image: string) {
    Particles(this.scene, image);
  }
}
