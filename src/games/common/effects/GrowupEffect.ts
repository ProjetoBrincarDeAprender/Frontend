import Phaser from "phaser";

export default function GrowupEffect(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject,
): void {
  scene.tweens.add({
    duration: 500,
    ease: "Cubic",
    scale: 2,
    targets: target,
    yoyo: true,
  });
}
