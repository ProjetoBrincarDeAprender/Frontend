import Phaser from "phaser";

export default function createStarParticles(
  scene: Phaser.Scene,
  centerX: number,
  centerY: number,
) {
  const particleCount = 8;
  const colors = [0xffd700, 0xffa500, 0xffff00, 0xff6347];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;

    const particle = scene.add.image(centerX, centerY, "star");
    particle.setScale(0.3 + Math.random() * 0.3);
    particle.setTint(colors[Math.floor(Math.random() * colors.length)]);
    particle.setDepth(99);

    const finalX = centerX + Math.cos(angle) * distance;
    const finalY = centerY + Math.sin(angle) * distance;

    scene.tweens.add({
      targets: particle,
      x: finalX,
      y: finalY,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      angle: 360 + Math.random() * 360,
      duration: 600 + Math.random() * 400,
      ease: "Power2.easeOut",
      onComplete: () => particle.destroy(),
    });

    scene.tweens.add({
      targets: particle,
      alpha: { from: 1, to: 0 },
      duration: 800,
      delay: 200,
      ease: "Power2.easeOut",
    });
  }
}
