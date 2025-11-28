export class ThoughtBubble {
  private scene: Phaser.Scene;
  private graphics?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(
    centerX: number,
    centerY: number,
    spacing: number,
    numberCount: number,
  ): Phaser.GameObjects.Graphics {
    this.graphics = this.scene.add.graphics();

    let bubbleWidth: number;
    let bubbleX: number;

    if (numberCount === 1) {
      bubbleWidth = 120;
      bubbleX = centerX;
    } else if (numberCount === 3) {
      bubbleWidth = spacing * 2 + 220;
      bubbleX = centerX + spacing;
    } else {
      // Ajustar largura do balão baseado no espaçamento
      bubbleWidth = spacing + 220;
      bubbleX = centerX + spacing / 2;
    }

    const bubbleHeight = 130;

    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.95);
    this.graphics.lineStyle(3, 0x000000, 1);

    this.graphics.fillRoundedRect(
      bubbleX - bubbleWidth / 2,
      centerY - bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      20,
    );
    this.graphics.strokeRoundedRect(
      bubbleX - bubbleWidth / 2,
      centerY - bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      20,
    );

    // Bolinhas de pensamento à DIREITA para o jogo de subtração
    // (coelho fica à esquerda)
    const thoughtCircles = [
      { x: bubbleX + 120, y: centerY + 70, radius: 8 },
      { x: bubbleX + 135, y: centerY + 80, radius: 6 },
      { x: bubbleX + 145, y: centerY + 95, radius: 4 },
    ];

    thoughtCircles.forEach((circle) => {
      this.graphics!.fillCircle(circle.x, circle.y, circle.radius);
      this.graphics!.strokeCircle(circle.x, circle.y, circle.radius);
    });

    this.graphics.setDepth(10);
    return this.graphics;
  }

  destroy() {
    this.graphics?.destroy();
    this.graphics = undefined;
  }
}
