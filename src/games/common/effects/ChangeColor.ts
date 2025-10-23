import Button from "@/games/clickedButton/logic/Button";
import Phaser from "phaser";

export default function ChangeColor(
  scene: Phaser.Scene,
  gameObject: Phaser.GameObjects.Image | Phaser.GameObjects.Text | Button,
  color: number,
  duration: number,
) {
  gameObject.setTint(color);
  scene.time.delayedCall(duration, () => gameObject.clearTint());
}
