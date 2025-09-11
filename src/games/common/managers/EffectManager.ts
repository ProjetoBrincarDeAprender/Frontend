import Phaser from "phaser";
import GrowupEffect from "../effects/GrowupEffect";

export default class EffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  growup(target: Phaser.GameObjects.GameObject) {
    GrowupEffect(this.scene, target);
  }
}
