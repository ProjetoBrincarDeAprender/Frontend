import Phaser from "phaser";
export const ParallaxEffect = (
  scene: Phaser.Scene,
  target: Phaser.GameObjects.Image,
  y: number = 20,
) => {
  scene.add.tween({
    targets: target,
    y: target.getCenter().y + y,
    duration: 2000,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  });
};
