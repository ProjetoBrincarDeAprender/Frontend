import Phaser from "phaser";

export interface SyllableDivisionConfig {
  DROPZONE_MARGIN?: number;
  DROPZONE_SIZE?: number;
  OPTION_FONT_SIZE?: number;
  OPTION_SIZE?: number;
  backgroundPath: string;
  syllabes: string[];
}

export default class SyllableDivision extends Phaser.Scene {
  private DROPZONE_MARGIN: number;
  private DROPZONE_SIZE: number;
  private OPTION_SIZE: number;
  private OPTION_FONT_SIZE: number;
  private config: SyllableDivisionConfig;
  private syllabes: string[];

  constructor(config: SyllableDivisionConfig) {
    super({ key: "SyllableDivision" });
    this.DROPZONE_MARGIN = config.DROPZONE_MARGIN || 20;
    this.DROPZONE_SIZE = config.DROPZONE_SIZE || 80;
    this.OPTION_FONT_SIZE = config.OPTION_FONT_SIZE || 58;
    this.OPTION_SIZE = config.OPTION_SIZE || 80;
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
    const sprites: Phaser.GameObjects.Container[] = [];

    this.syllabes.forEach((syllabe) => {
      targets.push(
        this.add.rectangle(
          0,
          0,
          this.DROPZONE_SIZE,
          this.DROPZONE_SIZE,
          0x000000,
        ),
      );

      dropzones.push(
        this.add
          .zone(0, 0, this.DROPZONE_SIZE, this.DROPZONE_SIZE)
          .setRectangleDropZone(this.DROPZONE_SIZE, this.DROPZONE_SIZE),
      );

      const text = this.add
        .text(0, 0, syllabe, {
          fontFamily: "Arial",
          fontSize: `${this.OPTION_FONT_SIZE}px`,
          color: "#00ff55ff",
        })
        .setOrigin(0.5);
      const rectangle = this.add.rectangle(
        0,
        0,
        this.OPTION_SIZE,
        this.OPTION_SIZE,
        0x1b9b50ff,
      );
      const container = this.add.container(0, 0, [rectangle, text]);
      container.setSize(this.OPTION_SIZE, this.OPTION_SIZE);
      sprites.push(container);
    });

    // Alinha objetos em linha horizontal
    Phaser.Actions.GridAlign(targets, {
      width: this.syllabes.length,
      height: 1,
      cellWidth: this.DROPZONE_MARGIN + this.DROPZONE_SIZE,
      cellHeight: 100,
      x:
        400 -
        (this.syllabes.length * (this.DROPZONE_MARGIN + this.DROPZONE_SIZE)) /
          2 +
        this.DROPZONE_MARGIN / 2,
      y: 400,
    });

    Phaser.Actions.GridAlign(dropzones, {
      width: this.syllabes.length,
      height: 1,
      cellWidth: this.DROPZONE_MARGIN + this.DROPZONE_SIZE,
      cellHeight: 100,
      x:
        400 -
        (this.syllabes.length * (this.DROPZONE_MARGIN + this.DROPZONE_SIZE)) /
          2 +
        this.DROPZONE_MARGIN / 2,
      y: 400,
    });

    Phaser.Actions.GridAlign(sprites, {
      width: this.syllabes.length,
      height: 1,
      cellWidth: this.OPTION_SIZE,
      cellHeight: this.OPTION_SIZE,
      x: 400 - (this.syllabes.length * this.OPTION_SIZE) / 2,
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
