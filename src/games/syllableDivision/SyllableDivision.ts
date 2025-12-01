import Phaser from "phaser";

export default class SyllableDivision extends Phaser.Scene {
  constructor() {
    super({ key: "SyllableDivision" });
  }

  preload() {}

  create() {
    // Elementos visuais
    const targets = [];
    targets.push(this.add.rectangle(400, 100, 80, 80, 0x000000, 0.7));
    targets.push(this.add.rectangle(400, 100, 80, 80, 0x000000, 0.7));
    targets.push(this.add.rectangle(400, 100, 80, 80, 0x000000, 0.7));

    const dropzones = [];
    dropzones.push(
      this.add.zone(400, 100, 80, 80).setRectangleDropZone(80, 80),
    );
    dropzones.push(
      this.add.zone(400, 100, 80, 80).setRectangleDropZone(80, 80),
    );
    dropzones.push(
      this.add.zone(400, 100, 80, 80).setRectangleDropZone(80, 80),
    );

    const sprites = [];
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));

    // Alinha objetos em linha horizontal
    Phaser.Actions.GridAlign(targets, {
      width: 3,
      height: 1,
      cellWidth: 120,
      cellHeight: 100,
      x: 400 - (3 * 120) / 2 + 20,
      y: 400,
    });

    Phaser.Actions.GridAlign(dropzones, {
      width: 3,
      height: 1,
      cellWidth: 120,
      cellHeight: 100,
      x: 400 - (3 * 120) / 2 + 20,
      y: 400,
    });

    Phaser.Actions.GridAlign(sprites, {
      width: 3,
      height: 1,
      cellWidth: 50,
      cellHeight: 50,
      x: 400 - (3 * 50) / 2,
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
}
