import { BaseButton } from './BaseButton';

export class StartButton extends BaseButton {
  constructor(scene: Phaser.Scene, x: number, y: number, onClickCallback: () => void) {
    super(scene, x, y, 200, 60, "JOGAR", 32);
    
    this.clickArea.on('pointerup', () => {
      this.onUp();
      onClickCallback();
    });
  }

  protected onHover() {
    super.onHover();
    this.text.setStyle({ color: "#ff0" });
  }

  protected onOut() {
    super.onOut();
    this.text.setStyle({ color: "#fff" });
  }
}