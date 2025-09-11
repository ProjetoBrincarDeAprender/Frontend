import Phaser from "phaser";
import ChangeColor from "../effects/ChangeColor";
import GrowupEffect from "../effects/GrowupEffect";
import Particles from "../effects/Particles";

export default class EffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  changeColor(text: Phaser.GameObjects.Text) {
    ChangeColor(this.scene, text);
  }

  growup(target: Phaser.GameObjects.GameObject) {
    GrowupEffect(this.scene, target);
  }

  particles(image: string) {
    Particles(this.scene, image);
  }
}
