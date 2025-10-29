export type Element = {
  textureKey: string;
  x: number;
  y: number;
  scale?: number;
  color?: number;
  animationFunction: () => void;
};

export class BgManager {
  protected scene: Phaser.Scene;
  private bg: Phaser.GameObjects.Image | undefined;
  protected elements: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createBackground(textureKey: string) {
    this.bg = this.scene.add.image(0, 0, textureKey).setOrigin(0, 0);

    const scaleX = this.scene.cameras.main.width / this.bg.width;
    const scaleY = this.scene.cameras.main.height / this.bg.height;
    const scale = Math.max(scaleX, scaleY);
    this.bg.setScale(scale);
  }

  getBackground() {
    return this.bg;
  }

  addElement(element: Element) {
    const newElement = this.scene.add
      .image(element.x, element.y, element.textureKey)
      .setScale(element.scale || 1)
      .setTint(element.color || 0xffffff);
    this.elements.push(newElement);

    if (element.animationFunction) {
      element.animationFunction();
    }
  }

  getElement(key: string) {
    return this.elements.find((el) => el.texture.key === key);
  }

  addElements(elements: Element[]) {
    elements.forEach((element) => this.addElement(element));
  }

  getElements() {
    return this.elements;
  }

  clearElements() {
    this.elements.forEach((element) => element.destroy());
    this.elements = [];
  }
}
