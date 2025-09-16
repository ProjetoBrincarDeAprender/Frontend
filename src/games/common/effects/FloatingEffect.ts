import Phaser from "phaser";

export default function FloatingEffect(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
  ease: string,
  y: number,
): void {
  scene.add.tween({
    duration: 400,
    ease: ease,
    repeat: -1,
    targets: target,
    y: y,
    yoyo: true,
  });
}
