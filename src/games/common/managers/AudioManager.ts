import Phaser from "phaser";
export class AudioManager {
  private scene: Phaser.Scene;
  private volume: number = 0.7;

  constructor(scene: Phaser.Scene, defaultVolume: number = 0.7) {
    this.scene = scene;
    if (defaultVolume) {
      this.volume = defaultVolume;
    }
    if (this.scene.registry.has("soundVolume")) {
      this.volume = this.scene.registry.get("soundVolume");
    } else {
      this.scene.registry.set("soundVolume", this.volume);
    }
    this.renderMuteButton();
  }

  setVolume(volume: number) {
    this.volume = volume;
    this.scene.registry.set("soundVolume", this.volume);
  }

  playSound(soundKey: string, volume?: number) {
    this.scene.sound.play(soundKey, {
      volume:
        volume || this.scene.registry.has("soundVolume")
          ? this.scene.registry.get("soundVolume")
          : this.volume,
    });
  }

  toggleSounds(): boolean {
    if (this.scene.sound.setMute(!this.scene.sound.mute)) {
      return true;
    }
    return false;
  }

  renderMuteButton() {
    const soundButton = this.scene.add.container(10, 10);

    const createButton = () => {
      const btnImage = this.scene.add
        .image(0, 0, this.scene.sound.mute ? "audioOff" : "audioOn")
        .setOrigin(0.5)
        .setScale(0.7);

      if (btnImage.postFX) {
        btnImage.postFX.addColorMatrix().negative();
      }

      soundButton.add(btnImage);
      soundButton.setSize(btnImage.width, btnImage.height);

      soundButton.on("pointerdown", () => {
        console.log("Before: " + this.scene.sound.mute);
        this.toggleSounds();
        console.log("After: " + this.scene.sound.mute);
        btnImage.setTexture(this.scene.sound.mute ? "audioOff" : "audioOn");
      });

      soundButton.setDepth(100);
      soundButton.setInteractive();
    };

    if (
      this.scene.textures.exists("audioOn") &&
      this.scene.textures.exists("audioOff")
    ) {
      createButton();
    } else {
      this.scene.load.on("complete", () => {
        if (
          this.scene.textures.exists("audioOn") &&
          this.scene.textures.exists("audioOff")
        ) {
          createButton();
        }
      });
    }
  }
}
