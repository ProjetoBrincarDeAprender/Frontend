import Phaser from "phaser";

export default function Particles(scene: Phaser.Scene, image: string) {
  scene.add.particles(400, 150, image, {
    // blendMode: "ADD",
    // emitting: false,
    duration: 200,
    lifespan: 4000,
    gravityY: 250,
    scale: { start: 0.8, end: 0 },
    speed: { min: 150, max: 250 },
  });
}
