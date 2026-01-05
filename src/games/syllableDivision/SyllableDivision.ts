import { AudioManager } from "../common/managers/AudioManager";
import Phaser from "phaser";
import EffectManager from "../clickedButton/logic/EffectManager";

export interface SyllableDivisionConfig {
  DROPZONE_MARGIN?: number;
  DROPZONE_SIZE?: number;
  IMAGE_POSITION?: { x: number; y: number };
  OPTION_FONT_SIZE?: number;
  OPTION_SIZE?: number;
  actualLevel?: number;
  instruction?: string;
  audiosPath: string;
  backgroundPath: string;
  imagesPath: string;
  levels: string[][];
}

export default class SyllableDivision extends Phaser.Scene {
  private DROPZONE_MARGIN: number;
  private DROPZONE_SIZE: number;
  private OPTION_SIZE: number;
  private OPTION_FONT_SIZE: number;
  private config: SyllableDivisionConfig;
  private dropzones: Phaser.GameObjects.Container[] = [];
  private effectManager: EffectManager;
  private image: Phaser.GameObjects.Image | null;
  private options: Phaser.GameObjects.Container[] = [];
  private syllabes: string[];

  constructor(config: SyllableDivisionConfig) {
    super({ key: "SyllableDivision" });
    this.DROPZONE_MARGIN = config.DROPZONE_MARGIN || 40;
    this.DROPZONE_SIZE = config.DROPZONE_SIZE || 80;
    this.OPTION_FONT_SIZE = config.OPTION_FONT_SIZE || 58;
    this.OPTION_SIZE = config.OPTION_SIZE || 80;
    this.config = config;
    this.effectManager = new EffectManager(this);
    this.image = null;
    this.syllabes = config.levels[config.actualLevel || 0];
  }

  static resetGame(scene: Phaser.Scene): void {
    scene.registry.set("actualLevel", 0);
    scene.registry.set("gameStarted", false);
  }

  preload(): void {
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
    this.config.levels.forEach((level) => {
      let word = "";
      level.forEach((syllabe) => {
        word += syllabe.toLowerCase();
      });
      if (word.includes("sofá")) {
        word = "sofa";
      }
      this.load.audio(word, this.config.audiosPath + word + ".mp3");
    });

    this.load.image("background", this.config.backgroundPath);
    this.config.levels.forEach((level) => {
      let word = "";
      level.forEach((syllabe) => {
        word += syllabe.toLowerCase();
      });
      if (word.includes("sofá")) {
        word = "sofa";
      }
      this.load.image(word, this.config.imagesPath + word + ".png");
    });
  }

  create(): void {
    // Verificar se o jogo já foi iniciado antes, se não, garantir que começa do nível 0
    if (!this.registry.get("gameStarted")) {
      this.registry.set("actualLevel", 0);
      this.registry.set("gameStarted", true);
    }

    if (this.registry.get("actualLevel") === undefined) {
      this.registry.set("actualLevel", 0);
    }
    this.addBackground();
    this.setupLevel();
    this.addInstructions();
    this.addEvents();
  }

  init() {
    new AudioManager(this);
  }

  addBackground(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const scaleFactor = Math.max(
      width / this.textures.get("background").getSourceImage().width,
      height / this.textures.get("background").getSourceImage().height,
    );
    this.add.image(width / 2, height / 2, "background").setScale(scaleFactor);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
  }

  addInstructions(): void {
    if (!this.config.instruction) return;

    this.add
      .text(this.cameras.main.centerX, 50, this.config.instruction, {
        fontFamily: "Arial Black , Arial",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  addImage() {
    const x = this.config.IMAGE_POSITION?.x || this.cameras.main.centerX;
    const y = this.config.IMAGE_POSITION?.y || this.cameras.main.centerY - 60;
    const actualLevel = this.registry.get("actualLevel");
    let word = "";
    this.config.levels[actualLevel].forEach((syllabe) => {
      word += syllabe.toLowerCase();
    });
    if (word.includes("sofá")) {
      word = "sofa";
    }

    this.image = this.add.image(x, y, word).setInteractive();
    this.image.setScale(400 / this.image.width);

    this.sound.play(word);
    this.image.on("pointerup", (_pointer: Phaser.Input.Pointer) => {
      this.sound.stopAll();
      this.sound.play(word);
    });
  }

  destroyImage() {
    if (this.image) {
      this.image.destroy();
      this.image = null;
    }
  }

  addDropzones(): void {
    const dropzones: Phaser.GameObjects.Container[] = [];

    this.syllabes.forEach((_value, index) => {
      const rectangle = this.add.rectangle(
        0,
        0,
        this.DROPZONE_SIZE,
        this.DROPZONE_SIZE,
        0x000a1f,
      );

      const stroke = rectangle.setStrokeStyle(4, 0xffffff);

      this.tweens.add({
        targets: stroke,
        alpha: 0.6,
        ease: "Sine.InOut",
        duration: 500,
        repeat: -1,
        yoyo: true,
      });

      const container = this.add.container(0, 0, [rectangle]);
      container.setSize(this.DROPZONE_SIZE, this.DROPZONE_SIZE);
      container.setInteractive();
      container.input!.dropZone = true;
      container.setData("index", index);
      dropzones.push(container);
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
      y: 480,
    });
  }

  destroyDropzones(): void {
    this.dropzones.forEach((zone) => zone.destroy());
    this.dropzones = [];
  }

  addOptions(): void {
    const options: Phaser.GameObjects.Container[] = [];

    this.syllabes.forEach((syllabe, index) => {
      const text = this.add
        .text(0, 0, syllabe, {
          fontFamily: "Arial",
          fontSize: `${this.OPTION_FONT_SIZE}px`,
          color: "#b2bce9ff",
        })
        .setOrigin(0.5)
        .setName("text");

      const rectangle = this.add
        .rectangle(0, 0, this.OPTION_SIZE, this.OPTION_SIZE, 0x007bff)
        .setName("rectangle");

      const container = this.add.container(0, 0, [rectangle, text]);
      container.setSize(this.OPTION_SIZE, this.OPTION_SIZE);
      container.setInteractive({ draggable: true });
      container.setData("index", index);
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
      y: 380,
    });
  }

  destroyOptions(): void {
    this.options.forEach((option) => option.destroy());
    this.options = [];
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
      "dragend",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container,
        dropped: boolean,
      ) => {
        if (!dropped) {
          this.incorrectDrop(gameObject);
        }
      },
    );

    this.input.on(
      "dragstart",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container,
      ) => {
        this.children.bringToTop(gameObject);
      },
    );

    this.input.on(
      "drop",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container,
        dropZone: Phaser.GameObjects.Container,
      ) => {
        this.handleDrop(gameObject, dropZone);
      },
    );
  }

  incorrectDrop(gameObject: Phaser.GameObjects.Container): void {
    gameObject.x = gameObject.input!.dragStartX;
    gameObject.y = gameObject.input!.dragStartY;
    this.sound.play("incorrect");
    this.effectManager.growup(gameObject, "bounce.out", 1.2, 200);
    this.effectManager.changeColor({
      gameObject: gameObject.getByName("text"),
      color: 0xff0000,
      duration: 400,
    });
    gameObject.disableInteractive();
    this.time.delayedCall(501, () => {
      gameObject.setInteractive();
    });
  }

  handleDrop(
    gameObject: Phaser.GameObjects.Container,
    dropZone: Phaser.GameObjects.Container,
  ): void {
    const gameObjectIndex = gameObject.getData("index");
    const dropZoneIndex = dropZone.getData("index");
    if (gameObjectIndex !== dropZoneIndex) {
      this.incorrectDrop(gameObject);
      return;
    }

    gameObject.setPosition(dropZone.x, dropZone.y);
    if (gameObject.input) gameObject.input.enabled = false;
    dropZone.destroy();
    this.dropzones = this.dropzones.filter((zone) => zone !== dropZone);
    this.sound.play("correct");

    this.effectManager.growup(gameObject, "expo.out", 1.6, 400);
    this.effectManager.changeColor({
      gameObject: gameObject.getByName("text"),
      color: 0x00ff00,
      duration: 800,
    });

    if (this.dropzones.length === 0) {
      this.endLevel();
    }
  }

  setupLevel() {
    this.syllabes = this.config.levels[this.registry.get("actualLevel")] || [];
    if (this.syllabes.length === 0) {
      this.scene.start("EndScene");
    } else {
      this.addImage();
      this.addInteractableComponents();
    }
  }

  endLevel(): void {
    this.registry.inc("actualLevel", 1);
    this.time.delayedCall(1000, () => {
      this.destroyImage();
      this.destroyDropzones();
      this.destroyOptions();

      if (
        this.registry.get("actualLevel") % 5 === 0 &&
        this.registry.get("actualLevel") !== 0 &&
        this.registry.get("actualLevel") < this.config.levels.length
      ) {
        this.scene.start("LevelCompleteScene");
      } else {
        this.setupLevel();
      }
    });
  }
}
