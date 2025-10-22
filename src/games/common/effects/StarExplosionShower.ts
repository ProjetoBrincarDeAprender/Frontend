import Phaser from "phaser";
import starExplosionEffect from "@/games/common/effects/StarExplosionEffect";

export default function starExplosionShower(
  scene: Phaser.Scene,
  centerX: number,
  centerY: number,
  count: number = 12,
) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const radius = 40 + Math.random() * 60;
    const starX = centerX + Math.cos(angle) * radius;
    const starY = centerY + Math.sin(angle) * radius;

    scene.time.delayedCall(i * 80, () => {
      starExplosionEffect(scene, starX, starY);
    });
  }
}
