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
    const startX = numbers.length === 3 ? 250 : 320;
    const startY = 110;
    const spacing = numbers.length === 3 ? 150 : 200;

    const bubble = this.thoughtBubble.create(startX, startY, spacing, numbers.length);
    this.images.push(bubble);

    imageKeys.forEach((imageKey, index) => {
      if (imageKey) {
        const image = this.scene.add.image(
          startX + (index * spacing), 
          startY, 
          imageKey
        );
        
        image.setScale(numbers.length === 3 ? 0.4 : 0.5);
        image.setDepth(11);
        this.images.push(image);
      }
    });
    
    // Adicionar símbolos de "+" entre os números
    for (let i = 0; i < numbers.length - 1; i++) {
      const plusX = startX + (i * spacing) + (spacing / 2);
      const plusText = this.scene.add.text(
        plusX, 
        startY - 10, 
        '+', 
        { 
          fontSize: numbers.length === 3 ? '36px' : '48px', 
          color: '#000000',
          fontFamily: 'Arial Black'
        }
      );
      plusText.setOrigin(0.5); // Centralizar o texto
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