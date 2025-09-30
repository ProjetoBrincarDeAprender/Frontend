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
    repeat: 0,
    targets: targets,
    x: x,
    onComplete: () => {
      (targets as any).x = -160;

      if (repeat === -1) {
        MoveEffect(scene, targets, x, duration, repeat, 0);
      }
    },
  });
}
