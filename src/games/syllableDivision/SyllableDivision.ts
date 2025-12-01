import Phaser from "phaser";

export default class SyllableDivision extends Phaser.Scene {
  constructor() {
    super({ key: "SyllableDivision" });
  }

  preload() {}

  create() {
    // Elementos visuais
    const rectangle = this.add.rectangle(400, 100, 100, 100, 0x000000, 0.7);
    const sprites = [];
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x00000000, 0.7));
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x00000000, 0.7));
    sprites.push(this.add.rectangle(0, 0, 50, 50, 0x1b9b50ff, 0.7));

    // Alinha objetos em linha horizontal
    Phaser.Actions.GridAlign(sprites, {
      width: 5,
      height: 1,
      cellWidth: 50,
      cellHeight: 50,
      x: 400 - (5 * 50) / 2,
      y: 300,
    });

    // Habilitar interatividade
    sprites.forEach((sprite) => {
      sprite.setInteractive({ draggable: true });
      sprite.on("drag", (_pointer: null, spriteX: number, spriteY: number) => {
        sprite.setPosition(spriteX, spriteY);
      });
    });

    // Cria dropzone
    this.add.zone(400, 100, 100, 100).setRectangleDropZone(100, 100);

    this.input.on("drop", () => rectangle.destroy());
  }
}
