export class BaseButton extends Phaser.GameObjects.Container {
  protected background!: Phaser.GameObjects.Graphics;
  protected text!: Phaser.GameObjects.Text;
  protected clickArea!: Phaser.GameObjects.Rectangle;
  
  protected defaultColor = 0x5abb30;
  protected hoverColor = 0x53a82d;
  protected buttonWidth: number;
  protected buttonHeight: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    fontSize: number = 24
  ) {
    super(scene, x, y);
    
    this.buttonWidth = width;
    this.buttonHeight = height;
    
    this.createBackground();
    this.createText(text, fontSize);
    this.createClickArea();
    this.setupInteractions();
    
    scene.add.existing(this);
  }

  protected createBackground() {
    this.background = this.scene.add.graphics();
    this.background.fillStyle(this.defaultColor);
    this.background.fillRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.add(this.background);
  }

  protected createText(text: string, fontSize: number) {
    this.text = this.scene.add.text(0, 0, text, {
      fontSize: `${fontSize}px`,
      color: "#ffffff",
      fontFamily: "Baloobhai"
    }).setOrigin(0.5);
    this.add(this.text);
  }

  protected createClickArea() {
    this.clickArea = this.scene.add.rectangle(0, 0, this.buttonWidth, this.buttonHeight, 0x000000, 0)
      .setInteractive({ cursor: 'pointer' });
    this.add(this.clickArea);
  }

  protected setupInteractions() {
    this.clickArea.on('pointerover', () => this.onHover());
    this.clickArea.on('pointerout', () => this.onOut());
    this.clickArea.on('pointerdown', () => this.onDown());
    this.clickArea.on('pointerup', () => this.onUp());
  }

  protected onHover() {
    this.background.clear();
    this.background.fillStyle(this.hoverColor);
    this.background.fillRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.setScale(1.05);
  }

  protected onOut() {
    this.background.clear();
    this.background.fillStyle(this.defaultColor);
    this.background.fillRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.setScale(1.0);
  }

  protected onDown() {
    this.setScale(0.95);
  }

  protected onUp() {
    this.setScale(1.05);
  }

  setText(newText: string) {
    this.text.setText(newText);
  }

  getText() {
    return this.text;
  }
}