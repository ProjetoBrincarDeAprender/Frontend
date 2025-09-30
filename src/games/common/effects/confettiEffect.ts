import Phaser from "phaser";

export default function confettiEffect(scene: Phaser.Scene) {
  const texture = scene.textures.createCanvas("confetti", 10, 10);
  if (texture) {
    const context = texture.getContext();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 10, 10);
    texture.refresh();
  }

  scene.add.particles(0, 0, "confetti", {
    emitZone: {
      type: "random",
      quantity: 1,
      source: new Phaser.Geom.Rectangle(0, -50, 800, 1),
    },
    speedY: { min: 100, max: 200 },
    speedX: { min: -100, max: 100 },
    accelerationY: { min: 25, max: 75 },
    lifespan: { min: 3000, max: 5000 },
    scaleX: {
      onUpdate: (_particle, _key, t) => {
        return Math.sin((t / 1) * Math.PI * 10);
      },
    },
    blendMode: "ADD",
    rotate: { min: -180, max: 180 },
    frequency: 50,
    quantity: 2,
    tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
  });
}
