import Phaser from "phaser";

export default function ChangeColor(
  scene: Phaser.Scene,
  text: Phaser.GameObjects.Text,
  color: number,
) {
  text.setTint(color);
  scene.time.delayedCall(1000, () => text.clearTint());
}
