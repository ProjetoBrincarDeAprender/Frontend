import Phaser from "phaser";
import CoordinationLevel, { type ShapeSpec } from "../logic/Level";

export default class CoordinationGameScene extends Phaser.Scene {
  private levels: CoordinationLevel[] = [];
  private currentLevelIndex = 0;
  private placedCount = 0;

  constructor() {
    super({ key: "CoordinationGameScene" });
  }

  init(data: { startLevel?: number } = {}) {
    this.currentLevelIndex = data.startLevel ?? 0;
    this.placedCount = 0;
  }

  preload() {
    // efeitos sonoros consistentes com outros jogos
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
  }

  create() {
    this.createLevels();
    this.addBackground();
    this.startLevel();
  }

  private createLevels() {
    if (this.levels.length > 0) return;
    const toyColors = [0xff6b6b, 0xffd93d, 0x6bc2ff, 0x7cd992, 0xbf7cff];
    const shapesA: ShapeSpec[] = [
      { type: "circle", color: toyColors[0] },
      { type: "square", color: toyColors[1] },
      { type: "triangle", color: toyColors[2] },
    ];
    const shapesB: ShapeSpec[] = [
      { type: "circle", color: toyColors[3] },
      { type: "rectangle", color: toyColors[4] },
      { type: "triangle", color: toyColors[0] },
      { type: "star", color: toyColors[2] },
    ];
    const shapesC: ShapeSpec[] = [
      { type: "square", color: toyColors[1] },
      { type: "rectangle", color: toyColors[3] },
      { type: "triangle", color: toyColors[4] },
      { type: "circle", color: toyColors[0] },
      { type: "star", color: toyColors[2] },
    ];
    // radius e gap podem ser diminuídos para aumentar a dificuldade
    this.levels = [
      new CoordinationLevel("Nível 1", shapesA, { radius: 50, gap: 40 }),
      new CoordinationLevel("Nível 2", shapesB, { radius: 38, gap: 28 }),
      new CoordinationLevel("Nível 3", shapesC, { radius: 28, gap: 18 }),
    ];
  }

  private addBackground() {
    // Fundo suave
    const g = this.add.graphics();
    g.fillStyle(0x96d6f3, 1);
    g.fillRect(0, 0, 800, 600);
  }

  private startLevel() {
    this.children.removeAll();
    this.addBackground();

    // permitir que drop zones recebam eventos de 'drag over'
    this.input.dragDistanceThreshold = 0;
    this.input.topOnly = false;
    // evita handlers duplicados ao reiniciar o nível
    this.input.removeAllListeners("drop");

    const level = this.levels[this.currentLevelIndex];
    const title =
      `${level.getName()}: Arraste as formas até as sombras`.toUpperCase();
    this.add
      .text(400, 50, title, {
        fontSize: "24px",
        color: "#1e3a8a",
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5);

    const shapes = level.getShapes();
    this.placedCount = 0;

    // Layout: sombras na metade direita, formas na metade esquerda
    const leftX = 200;
    const rightX = 600;
    const r = level.getRadius(50);
    const gap = level.getGap(40);
    const startY = 170;
    const hitSize = r * 2.4; // cobre o maior lado (retângulo)
    const spacingY = 2 * r + gap; // garante que não se encostem

    // embaralhar apenas as FORMAS (lado esquerdo) mantendo as posições/slots
    const pieceOrder = this.shuffleIndices(shapes.length);

    shapes.forEach((shadowSpec, i) => {
      const y = startY + i * spacingY;
      const shadow = this.createShapeGraphic(rightX, y, shadowSpec, true, r);
      shadow.setName(`${shadowSpec.type}-target-${i}`);
      // Área alvo para hit test
      const targetZone = this.add
        .zone(rightX, y, hitSize, hitSize)
        .setRectangleDropZone(hitSize, hitSize);
      targetZone.setName(`${shadowSpec.type}-zone-${i}`);

      const pieceSpec = shapes[pieceOrder[i]];
      const piece = this.createShapeGraphic(leftX, y, pieceSpec, false, r);
      piece.setName(`${pieceSpec.type}-piece-${i}`);
      // Definir hit area explícita para permitir eventos em Graphics
      const hitArea = new Phaser.Geom.Rectangle(
        -hitSize / 2,
        -hitSize / 2,
        hitSize,
        hitSize,
      );
      piece.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      this.input.setDraggable(piece);
      // Cursor amigável
      piece.on("pointerover", () => this.input.setDefaultCursor("grab"));
      piece.on("pointerout", () => this.input.setDefaultCursor("default"));

      piece.on("dragstart", () => {
        piece.setDepth(1000);
        piece.setAlpha(0.9);
      });

      piece.on("drag", (_pointer: any, dragX: number, dragY: number) => {
        piece.setPosition(dragX, dragY);
      });

      piece.on("dragend", () => {
        piece.setAlpha(1);
        piece.setDepth(1);
      });

      this.input.on(
        "drop",
        (
          _pointer: Phaser.Input.Pointer,
          gameObject: Phaser.GameObjects.GameObject,
          dropZone: Phaser.GameObjects.Zone,
        ) => {
          if (gameObject !== piece) return;
          const ok = this.validateDrop(piece, dropZone.name as string);
          if (ok) {
            this.sound.play("correct");
            this.snapTo(piece, dropZone.x, dropZone.y);
            piece.disableInteractive();
            this.placedCount++;
            this.tweenPulse(piece);
            if (this.placedCount === shapes.length) {
              this.time.delayedCall(800, () => {
                if (this.currentLevelIndex < this.levels.length - 1) {
                  this.currentLevelIndex++;
                  this.startLevel();
                } else {
                  this.scene.start("EndScene");
                }
              });
            }
          } else {
            this.sound.play("incorrect");
            this.tweenShake(piece);
          }
        },
      );
    });
  }

  private validateDrop(piece: Phaser.GameObjects.Graphics, zoneName: string) {
    const type = piece.getData("shapeType");
    if (!type) return false;
    return zoneName.startsWith(`${type}-zone`);
  }

  private snapTo(piece: Phaser.GameObjects.Graphics, x: number, y: number) {
    this.tweens.add({
      targets: piece,
      x,
      y,
      duration: 150,
      ease: "Sine.easeOut",
    });
  }

  private tweenPulse(piece: Phaser.GameObjects.Graphics) {
    this.tweens.add({
      targets: piece,
      scale: { from: 0.98, to: 1.05 },
      duration: 160,
      yoyo: true,
      ease: "Back.easeOut",
    });
  }

  private tweenShake(piece: Phaser.GameObjects.Graphics) {
    this.tweens.add({
      targets: piece,
      x: "+=12",
      duration: 60,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });
  }

  // Embaralha índices 0..n-1. Garante que o resultado não seja a ordem identidade
  // quando existir mais de um item, evitando emparelhamento trivial.
  private shuffleIndices(n: number): number[] {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Evita identidade quando n>1
    if (n > 1 && arr.every((v, i) => v === i)) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    return arr;
  }

  private createShapeGraphic(
    x: number,
    y: number,
    spec: ShapeSpec,
    isShadow: boolean,
    radius = 50,
  ): Phaser.GameObjects.Graphics {
    const g = this.add.graphics({ x, y });
    const color = isShadow ? 0x1f2937 : spec.color; // sombra escura
    const stroke = isShadow ? 0x111827 : 0x000000; // contorno
    const shade = isShadow ? 0x374151 : 0xffffff; // leve luz/sombra

    // base
    g.fillStyle(color, 1);
    g.lineStyle(3, stroke, 1);

    // desenha forma
    this.drawShape(g, spec.type, 0, 0, radius);
    g.strokePath();

    // efeito cartunesco de luz/sombra
    g.lineStyle(0, 0, 0);
    g.fillStyle(shade, isShadow ? 0.1 : 0.15);
    this.drawHighlight(g, spec.type, 0, -radius * 0.2, radius * 0.9);

    g.setData("shapeType", spec.type);
    g.setScale(1);
    return g;
  }

  private drawShape(
    g: Phaser.GameObjects.Graphics,
    type: string,
    x: number,
    y: number,
    r: number,
  ) {
    g.beginPath();
    switch (type) {
      case "circle":
        g.fillCircle(x, y, r);
        break;
      case "square":
        g.fillRoundedRect(x - r, y - r, r * 2, r * 2, 12);
        break;
      case "rectangle":
        g.fillRoundedRect(x - r * 1.2, y - r * 0.7, r * 2.4, r * 1.4, 12);
        break;
      case "triangle":
        g.moveTo(x, y - r);
        g.lineTo(x + r, y + r);
        g.lineTo(x - r, y + r);
        g.closePath();
        g.fillPath();
        break;
      case "star":
        this.drawStar(g, x, y, 5, r, r / 2);
        break;
    }
  }

  private drawHighlight(
    g: Phaser.GameObjects.Graphics,
    type: string,
    x: number,
    y: number,
    r: number,
  ) {
    g.beginPath();
    switch (type) {
      case "circle":
        g.fillCircle(x - r / 3, y - r / 3, r / 3);
        break;
      case "square":
        g.fillRoundedRect(x - r * 0.8, y - r * 0.8, r * 0.6, r * 0.3, 8);
        break;
      case "rectangle":
        g.fillRoundedRect(x - r * 0.9, y - r * 0.4, r * 0.7, r * 0.25, 8);
        break;
      case "triangle":
        g.moveTo(x - r * 0.6, y - r * 0.2);
        g.lineTo(x - r * 0.2, y - r * 0.8);
        g.lineTo(x - r * 0.1, y - r * 0.1);
        g.closePath();
        g.fillPath();
        break;
      case "star":
        this.drawStar(g, x - r * 0.3, y - r * 0.3, 5, r * 0.4, r * 0.18);
        break;
    }
  }

  private drawStar(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    points: number,
    outerRadius: number,
    innerRadius: number,
  ) {
    let rot = (Math.PI / 2) * 3;
    let cx = x;
    let cy = y;
    let step = Math.PI / points;
    g.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < points; i++) {
      cx = x + Math.cos(rot) * outerRadius;
      cy = y + Math.sin(rot) * outerRadius;
      g.lineTo(cx, cy);
      rot += step;

      cx = x + Math.cos(rot) * innerRadius;
      cy = y + Math.sin(rot) * innerRadius;
      g.lineTo(cx, cy);
      rot += step;
    }
    g.lineTo(x, y - outerRadius);
    g.closePath();
    g.fillPath();
  }
}
