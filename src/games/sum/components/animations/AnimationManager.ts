export class AnimationManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  correctAnswerEffect(target: Phaser.GameObjects.GameObject) {
    this.scene.tweens.add({
      targets: target,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });

    this.applyTint(target, 0x00ff00);
  }

  incorrectAnswerEffect(target: Phaser.GameObjects.GameObject) {
    this.applyTint(target, 0xff0000);

    if ('x' in target && typeof target.x === 'number') {
      const originalX = target.x;
      
      this.scene.tweens.add({
        targets: target,
        duration: 50,
        yoyo: true,
        repeat: 3,
        ease: 'Power2',
        onComplete: () => {
          target.x = originalX;
        }
      });
    }
  }

  private applyTint(target: Phaser.GameObjects.GameObject, color: number) {
    if (this.hasSetTint(target)) {
      target.setTint(color);
      this.scene.time.delayedCall(1000, () => {
        if (this.hasClearTint(target)) {
          target.clearTint();
        }
      });
    } else if (target instanceof Phaser.GameObjects.Container) {
      target.each((child: Phaser.GameObjects.GameObject) => {
        if (this.hasSetTint(child)) {
          child.setTint(color);
        }
      });
      
      this.scene.time.delayedCall(1000, () => {
        target.each((child: Phaser.GameObjects.GameObject) => {
          if (this.hasClearTint(child)) {
            child.clearTint();
          }
        });
      });
    }
  }

  private hasSetTint(obj: unknown): obj is { setTint: (tint: number) => void } {
    return obj !== null && 
           obj !== undefined && 
           typeof obj === 'object' && 
           'setTint' in obj && 
           typeof (obj as { setTint?: unknown }).setTint === 'function';
  }

  private hasClearTint(obj: unknown): obj is { clearTint: () => void } {
    return obj !== null && 
           obj !== undefined && 
           typeof obj === 'object' && 
           'clearTint' in obj && 
           typeof (obj as { clearTint?: unknown }).clearTint === 'function';
  }

  starEffect(x: number, y: number) {
    const star = this.scene.add.image(x, y - 50, "star");
    star.setScale(0.8);
    star.setTint(0xFFD700);
    
    this.scene.tweens.add({
      targets: star,
      y: y - 100,
      alpha: 0,
      duration: 1000,
      onComplete: () => star.destroy()
    });
  }

  starExplosionEffect(x: number, y: number) {
    const star = this.scene.add.image(x, y, "star");
    star.setScale(0);
    star.setTint(0xFFD700);
    star.setDepth(100);
    
    this.scene.tweens.add({
      targets: star,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: 360,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.createStarParticles(x, y);
        
        this.scene.tweens.add({
          targets: star,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          angle: 720,
          duration: 400,
          ease: 'Power2.easeIn',
          onComplete: () => star.destroy()
        });
      }
    });

    this.scene.tweens.add({
      targets: star,
      alpha: { from: 1, to: 0.7 },
      duration: 150,
      yoyo: true,
      repeat: 3,
      ease: 'Power2'
    });
  }

  private createStarParticles(centerX: number, centerY: number) {
    const particleCount = 8;
    const colors = [0xFFD700, 0xFFA500, 0xFFFF00, 0xFF6347];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      
      const particle = this.scene.add.image(centerX, centerY, "star");
      particle.setScale(0.3 + Math.random() * 0.3);
      particle.setTint(colors[Math.floor(Math.random() * colors.length)]);
      particle.setDepth(99);
      
      const finalX = centerX + Math.cos(angle) * distance;
      const finalY = centerY + Math.sin(angle) * distance;
      
      this.scene.tweens.add({
        targets: particle,
        x: finalX,
        y: finalY,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        angle: 360 + Math.random() * 360,
        duration: 600 + Math.random() * 400,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
      
      this.scene.tweens.add({
        targets: particle,
        alpha: { from: 1, to: 0 },
        duration: 800,
        delay: 200,
        ease: 'Power2.easeOut'
      });
    }
  }

  buttonClickEffect(button: Phaser.GameObjects.Container) {
    this.scene.tweens.add({
      targets: button,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      ease: 'Power2',
      yoyo: true
    });
  }

  fadeInScene(targets: (Phaser.GameObjects.GameObject & { setAlpha: (alpha: number) => void })[]) {
    targets.forEach(target => {
      target.setAlpha(0);
      this.scene.tweens.add({
        targets: target,
        alpha: 1,
        duration: 500,
        ease: 'Power2'
      });
    });
  }

  starExplosionShower(centerX: number, centerY: number, count: number = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const radius = 40 + Math.random() * 60;
      const starX = centerX + Math.cos(angle) * radius;
      const starY = centerY + Math.sin(angle) * radius;
      
      this.scene.time.delayedCall(i * 80, () => {
        this.starExplosionEffect(starX, starY);
      });
    }
  }
}