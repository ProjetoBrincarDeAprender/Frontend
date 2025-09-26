import Phaser from "phaser";

export default function OverlayEffect(
  scene: Phaser.Scene,
  overlay: number,
): void {
  const gameWidth = scene.cameras.main.width;
  const gameHeight = scene.cameras.main.height;
  scene.add.rectangle(
    gameWidth / 2,
    gameHeight / 2,
    gameWidth,
    gameHeight,
    0x000000,
    overlay,
  );
}
