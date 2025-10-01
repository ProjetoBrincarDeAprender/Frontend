export class AudioManager {
  private scene: Phaser.Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preloadSounds() {
    this.scene.load.audio('correct', '/assets/common/sounds/correct.mp3');
    this.scene.load.audio('correct2', '/assets/common/sounds/correct2.mp3');
    this.scene.load.audio('incorrect', '/assets/common/sounds/incorrect.mp3');
    this.scene.load.audio('complete', '/assets/common/sounds/complete.mp3');
  }

  createSounds() {
    try {
      if (this.scene.cache.audio.exists('correct')) {
        this.sounds.set('correct', this.scene.sound.add('correct', { volume: 1.5 }));
      }
      if (this.scene.cache.audio.exists('correct2')) {
        this.sounds.set('correct2', this.scene.sound.add('correct2', { volume: 1.5 }));
      }
      if (this.scene.cache.audio.exists('incorrect')) {
        this.sounds.set('incorrect', this.scene.sound.add('incorrect', { volume: 1.5 }));
      }
      if (this.scene.cache.audio.exists('complete')) {
        this.sounds.set('complete', this.scene.sound.add('complete', { volume: 1.7 }));
      }
    } catch (error) {
      console.warn('Erro ao criar sons:', error);
    }
  }

  playCorrect() {
    this.sounds.get('correct')?.play();
  }

  playCorrect2() {
    this.sounds.get('correct2')?.play();
  }

  playIncorrect() {
    this.sounds.get('incorrect')?.play();
  }

  playComplete() {
    this.sounds.get('complete')?.play();
  }

  stopAll() {
    this.sounds.forEach(sound => sound.stop());
  }
}