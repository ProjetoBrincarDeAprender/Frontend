import Phaser from "phaser";

export default function ChangeColor(
  scene: Phaser.Scene,
  text: Phaser.GameObjects.Text,
) {
  text.setTint(0x00ff00);
  scene.time.delayedCall(1000, () => text.clearTint());
}
