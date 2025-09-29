import Phaser from "phaser";

interface MoveEffectConfig {
  scene: Phaser.Scene;
  target: Phaser.GameObjects.GameObject;
  endX: number;
  duration: number;
  repeat: number;
  delay?: number;
  resetX?: number;
}

export default function MoveEffect<T extends Phaser.GameObjects.GameObject>(
  config: MoveEffectConfig,
): void;
export default function MoveEffect<T extends Phaser.GameObjects.GameObject>(
  scene: Phaser.Scene,
  targets: T,
  x: number,
  duration: number,
  repeat: number,
  delay: number,
): void;
export default function MoveEffect<T extends Phaser.GameObjects.GameObject>(
  sceneOrConfig: Phaser.Scene | MoveEffectConfig,
  targets?: T,
  x?: number,
  duration?: number,
  repeat?: number,
  delay?: number,
) {
  let config: MoveEffectConfig;

  if (typeof sceneOrConfig === "object" && "scene" in sceneOrConfig) {
    config = sceneOrConfig as MoveEffectConfig;
  } else {
    config = {
      scene: sceneOrConfig as Phaser.Scene,
      target: targets!,
      endX: x!,
      duration: duration!,
      repeat: repeat!,
      delay: delay || 0,
      resetX: -160,
    };
  }

  const {
    scene,
    target,
    endX,
    duration: tweenDuration,
    repeat: repeatCount,
    delay: tweenDelay = 0,
    resetX = -160,
  } = config;

  scene.tweens.add({
    delay: tweenDelay,
    duration: tweenDuration,
    repeat: 0,
    targets: target,
    x: endX,
    onComplete: () => {
      (target as any).x = resetX;

      if (repeatCount === -1) {
        MoveEffect({
          scene,
          target,
          endX,
          duration: tweenDuration,
          repeat: repeatCount,
          delay: 0,
          resetX,
        });
      }
    },
  });
}
