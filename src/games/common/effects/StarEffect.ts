import Phaser from "phaser";

export default function starEffect(scene: Phaser.Scene, x: number, y: number) {
  const star = scene.add.image(x, y - 50, "star");
  star.setScale(0.8);
  star.setTint(0xffd700);

  scene.tweens.add({
    targets: star,
    y: y - 100,
    alpha: 0,
    duration: 1000,
    onComplete: () => star.destroy(),
  });
}
