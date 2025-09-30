import { BaseButton } from './BaseButton';

interface FullscreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenDocumentElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export class FullscreenButton extends BaseButton {
  private isFullscreen: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 50, 50, "⛶", 24);
    
    this.setupFullscreenLogic();
    this.updateButtonAppearance();
  }

  private setupFullscreenLogic() {
    this.clickArea.on('pointerup', () => {
      this.onUp();
      this.toggleFullscreen();
    });

    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
      this.updateButtonText();
    });
  }

  private toggleFullscreen() {
    try {
      if (!this.isFullscreen) {
        const docElement = document.documentElement as FullscreenDocumentElement;
        
        if (docElement.requestFullscreen) {
          docElement.requestFullscreen();
        } else if (docElement.webkitRequestFullscreen) {
          docElement.webkitRequestFullscreen();
        } else if (docElement.msRequestFullscreen) {
          docElement.msRequestFullscreen();
        }
      } else {
        const doc = document as FullscreenDocument;
        
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Erro ao alternar tela cheia:', error);
    }
  }

  private updateButtonText() {
    const icon = this.isFullscreen ? "Sair" : "⛶";
    this.setText(icon);
  }

  private updateButtonAppearance() {
    this.defaultColor = 0x2c3e50;
    this.hoverColor = 0x34495e;
    
    this.background.clear();
    this.background.fillStyle(this.defaultColor, 0.8);
    this.background.lineStyle(2, 0xffffff, 0.8);
    this.background.fillRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.background.strokeRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
  }

  protected onHover() {
    this.background.clear();
    this.background.fillStyle(this.hoverColor, 0.9);
    this.background.lineStyle(2, 0xffd700, 1);
    this.background.fillRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.background.strokeRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.setScale(1.1);
  }

  protected onOut() {
    this.background.clear();
    this.background.fillStyle(this.defaultColor, 0.8);
    this.background.lineStyle(2, 0xffffff, 0.8);
    this.background.fillRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.background.strokeRoundedRect(-this.buttonWidth/2, -this.buttonHeight/2, this.buttonWidth, this.buttonHeight, 8);
    this.setScale(1.0);
  }
}