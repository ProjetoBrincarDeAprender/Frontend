import Phaser from "phaser";

export default function MoveEffect<T extends Phaser.GameObjects.GameObject>(
  scene: Phaser.Scene,
  targets: T,
  x: number,
  duration: number,
  repeat: number,
  delay: number,
) {
  scene.tweens.add({
    delay: delay,
    duration: duration,
    repeat: repeat,
    targets: targets,
    x: x,
  });
}
