import { ThoughtBubble } from './ThoughtBubble';

export class NumberDisplay {
  private scene: Phaser.Scene;
  private images: Phaser.GameObjects.GameObject[] = [];
  private thoughtBubble: ThoughtBubble;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.thoughtBubble = new ThoughtBubble(scene);
  }

  display(numbers: number[]) {
    this.clear();
    
    const imageKeys = this.getImageKeysFromNumbers(numbers);
    const startX = 320;
    const startY = 110;
    const spacing = 200;

    const bubble = this.thoughtBubble.create(startX, startY, spacing, numbers.length);
    this.images.push(bubble);

    imageKeys.forEach((imageKey, index) => {
      if (imageKey) {
        const image = this.scene.add.image(
          startX + (index * spacing), 
          startY, 
          imageKey
        );
        
        image.setScale(0.5);
        image.setDepth(11);
        this.images.push(image);
      }
    });
    
    if (numbers.length === 2) {
      const plusText = this.scene.add.text(
        startX + spacing - 120, 
        startY - 10, 
        '+', 
        { 
          fontSize: '48px', 
          color: '#000000',
          fontFamily: 'Arial Black'
        }
      );
      plusText.setDepth(11);
      this.images.push(plusText);
    }
  }

  private getImageKeysFromNumbers(numbers: number[]): (string | null)[] {
    const numberToImageKey: { [key: number]: string } = {
      1: 'um',
      2: 'dois',
      3: 'tres',
      4: 'quatro',
      5: 'cinco',
    };
    
    return numbers.map(num => numberToImageKey[num] || null);
  }

  clear() {
    this.images.forEach(obj => obj.destroy());
    this.images = [];
  }
}