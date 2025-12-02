import Phaser from "phaser";

export interface SyllableDivisionConfig {
  backgroundPath: string;
  syllabes: string[];
}

export default class SyllableDivision extends Phaser.Scene {
  private config: SyllableDivisionConfig;
  private syllabes: string[];

  constructor(config: SyllableDivisionConfig) {
    super({ key: "SyllableDivision" });
    this.config = config;
    this.syllabes = config.syllabes;
  }

  preload(): void {
    this.load.image("background", this.config.backgroundPath);
  }

  create(): void {
    // Background
    this.addBackground();

    // Elementos visuais
    const targets: Phaser.GameObjects.Rectangle[] = [];
    const dropzones: Phaser.GameObjects.Zone[] = [];
    const sprites: Phaser.GameObjects.Rectangle[] = [];

    this.syllabes.forEach(() => {
      targets.push(this.add.rectangle(400, 100, 80, 80, 0x000000, 0.7));
      dropzones.push(
        this.add.zone(400, 100, 80, 80).setRectangleDropZone(80, 80),
      );
      sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));
    });

    // Alinha objetos em linha horizontal
    Phaser.Actions.GridAlign(targets, {
      width: this.syllabes.length,
      height: 1,
      cellWidth: 120,
      cellHeight: 100,
      x: 400 - (this.syllabes.length * 120) / 2 + 20,
      y: 400,
    });

    Phaser.Actions.GridAlign(dropzones, {
      width: this.syllabes.length,
      height: 1,
      cellWidth: 120,
      cellHeight: 100,
      x: 400 - (this.syllabes.length * 120) / 2 + 20,
      y: 400,
    });

    Phaser.Actions.GridAlign(sprites, {
      width: this.syllabes.length,
      height: 1,
      cellWidth: 50,
      cellHeight: 50,
      x: 400 - (this.syllabes.length * 50) / 2,
      y: 300,
    });

    // Habilitar interatividade
    sprites.forEach((sprite) => {
      sprite.setInteractive({ draggable: true });
      sprite.on(
        "drag",
        (_pointer: Phaser.Input.Pointer, spriteX: number, spriteY: number) => {
          sprite.setPosition(spriteX, spriteY);
        },
      );
    });

    // Eventos
    this.input.on(
      "drop",
      (
        _pointer: Phaser.Input.Pointer,
        sprite: Phaser.GameObjects.Rectangle,
        dropZone: Phaser.GameObjects.Zone,
      ) => {
        sprite.setPosition(dropZone.x, dropZone.y);
        if (sprite.input) sprite.input.enabled = false;
      },
    );
  }

  addBackground(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const scaleFactor = Math.max(
      width / this.textures.get("background").getSourceImage().width,
      height / this.textures.get("background").getSourceImage().height,
    );
    this.add.image(width / 2, height / 2, "background").setScale(scaleFactor);
  }
}
