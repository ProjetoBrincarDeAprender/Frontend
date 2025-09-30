import { BaseButton } from './BaseButton';

export class SubmitButton extends BaseButton {
  constructor(scene: Phaser.Scene, x: number, y: number, onClickCallback: () => void) {
    super(scene, x, y, 120, 50, "ENVIAR", 24);
    
    this.clickArea.on('pointerup', () => {
      this.onUp();
      onClickCallback();
    });
  }
}