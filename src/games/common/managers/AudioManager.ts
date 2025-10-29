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
    const soundButton = this.scene.add.container(1, 1);

    const btnText = this.scene.add
      .text(10, 10, this.scene.sound.mute ? "-" : "", {
        fontFamily: "Arial",
        fontSize: 32,
        padding: {
          x: 5,
          y: 5,
        },
      })
      .setOrigin(0.5);

    soundButton.add(btnText);

    soundButton.setSize(btnText.width, btnText.height);

    soundButton.on("pointerdown", () => {
      console.log("Before: " + this.scene.sound.mute);
      this.toggleSounds();
      console.log("After: " + this.scene.sound.mute);
      if (this.scene.sound.mute) {
        btnText.setText("-");
        return;
      }
      btnText.setText("");
    });

    soundButton.setDepth(100);
    soundButton.setInteractive();
  }
}
