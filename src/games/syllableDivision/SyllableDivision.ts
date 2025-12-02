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
  private dropzones: Phaser.GameObjects.Rectangle[] = [];
  private options: Phaser.GameObjects.Container[] = [];
  private syllabes: string[];

  constructor(config: SyllableDivisionConfig) {
    super({ key: "SyllableDivision" });
    this.DROPZONE_MARGIN = config.DROPZONE_MARGIN || 40;
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
    this.addBackground();
    this.addInteractableComponents();
    this.addEvents();
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

  addDropzones(): void {
    const dropzones: Phaser.GameObjects.Rectangle[] = [];

    this.syllabes.forEach(() => {
      const rectangle = this.add.rectangle(
        0,
        0,
        this.DROPZONE_SIZE,
        this.DROPZONE_SIZE,
        0x000a1f,
        // #000a1fff
      );
      rectangle.setInteractive();
      rectangle.input!.dropZone = true;
      dropzones.push(rectangle);
    });
    this.dropzones = dropzones;
  }

  alignDropzones(): void {
    Phaser.Actions.GridAlign(this.dropzones, {
      width: this.dropzones.length,
      height: 1,
      cellWidth: this.DROPZONE_MARGIN + this.DROPZONE_SIZE,
      cellHeight: this.DROPZONE_SIZE,
      x:
        this.cameras.main.centerX -
        (this.syllabes.length * (this.DROPZONE_MARGIN + this.DROPZONE_SIZE)) /
          2 +
        this.DROPZONE_MARGIN / 2,
      y: 400,
    });
  }

  addOptions(): void {
    const options: Phaser.GameObjects.Container[] = [];

    this.syllabes.forEach((syllabe) => {
      const text = this.add
        .text(0, 0, syllabe, {
          fontFamily: "Arial",
          fontSize: `${this.OPTION_FONT_SIZE}px`,
          color: "#b2bce9ff",
        })
        .setOrigin(0.5);
      const rectangle = this.add.rectangle(
        0,
        0,
        this.OPTION_SIZE,
        this.OPTION_SIZE,
        0x007bff,
      );
      const container = this.add.container(0, 0, [rectangle, text]);
      container.setSize(this.OPTION_SIZE, this.OPTION_SIZE);
      container.setInteractive({ draggable: true });
      options.push(container);
    });
    this.options = options;
  }

  alignOptions(): void {
    Phaser.Actions.GridAlign(this.options, {
      width: this.options.length,
      height: 1,
      cellWidth: this.OPTION_SIZE,
      cellHeight: this.OPTION_SIZE,
      x: 400 - (this.options.length * this.OPTION_SIZE) / 2,
      y: 300,
    });
  }

  addInteractableComponents(): void {
    this.addDropzones();
    this.addOptions();
    this.alignDropzones();
    this.alignOptions();
  }

  addEvents(): void {
    this.input.on(
      "drag",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container,
        dragX: number,
        dragY: number,
      ) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      },
    );

    this.input.on(
      "drop",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container,
        dropZone: Phaser.GameObjects.Container,
      ) => {
        gameObject.setPosition(dropZone.x, dropZone.y);
        if (gameObject.input) gameObject.input.enabled = false;
      },
    );
  }
}
