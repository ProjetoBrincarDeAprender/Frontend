import Phaser from "phaser";
import StarExplosionEffect from "./CreateStarParticles";

export default function starExplosionEffect(
  scene: Phaser.Scene,
  x: number,
  y: number,
) {
  const star = scene.add.image(x, y, "star");
  star.setScale(0);
  star.setTint(0xffd700);
  star.setDepth(100);

  scene.tweens.add({
    targets: star,
    scaleX: 1.2,
    scaleY: 1.2,
    angle: 360,
    duration: 300,
    ease: "Back.easeOut",
    onComplete: () => {
      StarExplosionEffect(scene, x, y);

      scene.tweens.add({
        targets: star,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        angle: 720,
        duration: 400,
        ease: "Power2.easeIn",
        onComplete: () => star.destroy(),
      });
    },
  });

  scene.tweens.add({
    targets: star,
    alpha: { from: 1, to: 0.7 },
    duration: 150,
    yoyo: true,
    repeat: 3,
    ease: "Power2",
  });
}
