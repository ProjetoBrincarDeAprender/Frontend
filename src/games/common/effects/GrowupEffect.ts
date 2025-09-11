import Phaser from "phaser";

export default function GrowupEffect(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject,
  ease: string,
  scale: number,
  duration: number,
): void {
  scene.tweens.add({
    duration: duration,
    ease: ease,
    scale: scale,
    targets: target,
    yoyo: true,
  });
}
