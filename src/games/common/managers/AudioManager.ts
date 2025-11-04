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
    const soundButton = this.scene.add.container(20, 20);

    const createButton = () => {
      const btnImage = this.scene.add
        .image(0, 0, this.scene.sound.mute ? "audioOff" : "audioOn")
        .setOrigin(0.5)
        .setScale(1.7);

      if (btnImage.postFX) {
        btnImage.postFX.addColorMatrix().negative();
      }

      soundButton.add(btnImage);
      soundButton.setDepth(100);

      // Área de clique baseada no tamanho exibido (considera escala)
      const hitRadius =
        Math.max(btnImage.displayWidth, btnImage.displayHeight) / 2;
      btnImage.setInteractive(
        new Phaser.Geom.Circle(0, 0, hitRadius),
        Phaser.Geom.Circle.Contains,
      );

      btnImage.on("pointerdown", () => {
        this.toggleSounds();
        btnImage.setTexture(this.scene.sound.mute ? "audioOff" : "audioOn");
      });

      btnImage.on("pointerover", () => {
        this.scene.input.setDefaultCursor("pointer");
      });
      btnImage.on("pointerout", () => {
        this.scene.input.setDefaultCursor("default");
      });
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
