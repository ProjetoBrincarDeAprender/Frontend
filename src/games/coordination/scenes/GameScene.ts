import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";
import Phaser from "phaser";
import CoordinationLevel, { type ShapeSpec } from "../logic/Level";

export default class CoordinationGameScene extends PreloadScene {
  private levels: CoordinationLevel[] = [];
  private currentLevelIndex = 0;
  private placedCount = 0;
  private dragTrail: Phaser.GameObjects.Graphics | null = null;
  // Camada apenas para os elementos do nível atual (não inclui fundo nem botão de áudio)
  private levelContainer?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "CoordinationGameScene" });
  }

  init(data: { startLevel?: number } = {}) {
    // Permite continuar do próximo nível usando Registry quando vindo da cena comum
    const regNext = this.registry.get("coordNextLevel");
    this.currentLevelIndex =
      data.startLevel ?? (typeof regNext === "number" ? regNext : 0);
    // limpa para evitar reaproveitar valor em reinícios
    this.registry.set("coordNextLevel", null);
    this.placedCount = 0;
    new AudioManager(this);
  }

  preload() {
    super.preload();
    // efeitos sonoros consistentes com outros jogos
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
    // Som de introdução para cada fase do jogo das formas
    this.load.audio("formsIntro", "/assets/forms/sounds/intro.mp3");

    // Recursos visuais para deixar o jogo mais bonito
    this.load.image("star-sparkle", "/assets/common/star.svg");
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
    // Gradiente de céu azul claro para baixo
    const g = this.add.graphics();
    g.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xe0f6ff, 0xe0f6ff, 1);
    g.fillRect(0, 0, 800, 600);

    // Adicionar decorações encantadoras
    this.addSun();
    this.addRainbow();
    this.addClouds();
    this.addFloatingStars();
    this.addButterflies();
    this.addBalloons();
  }

  // ☀️ Sol sorridente e animado
  private addSun() {
    const sun = this.add.graphics();
    sun.fillStyle(0xffd700, 1);
    sun.fillCircle(0, 0, 35);

    // Raios do sol
    sun.lineStyle(4, 0xffa500, 1);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const x1 = Math.cos(angle) * 40;
      const y1 = Math.sin(angle) * 40;
      const x2 = Math.cos(angle) * 55;
      const y2 = Math.sin(angle) * 55;
      sun.lineBetween(x1, y1, x2, y2);
    }

    sun.setPosition(720, 80);

    // Animação de rotação suave
    this.tweens.add({
      targets: sun,
      rotation: Math.PI * 2,
      duration: 20000,
      repeat: -1,
      ease: "Linear",
    });

    // Animação de pulsação
    this.tweens.add({
      targets: sun,
      scale: { from: 0.95, to: 1.05 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  // 🌈 Arco-íris decorativo
  private addRainbow() {
    const rainbow = this.add.graphics();
    const colors = [
      0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3,
    ];
    const centerX = 100;
    const centerY = 150;

    colors.forEach((color, i) => {
      rainbow.lineStyle(8, color, 0.6);
      rainbow.beginPath();
      rainbow.arc(centerX, centerY, 80 + i * 10, Math.PI, 0, false);
      rainbow.strokePath();
    });

    rainbow.setAlpha(0.7);
  }

  // ☁️ Nuvens flutuantes
  private addClouds() {
    const cloudPositions = [
      { x: 150, y: 100, scale: 0.8, speed: 25000 },
      { x: 450, y: 130, scale: 1.0, speed: 30000 },
      { x: 650, y: 90, scale: 0.7, speed: 22000 },
    ];

    cloudPositions.forEach((pos) => {
      const cloud = this.createCloud(pos.x, pos.y);
      cloud.setScale(pos.scale);
      cloud.setAlpha(0.85);

      // Movimento horizontal suave
      this.tweens.add({
        targets: cloud,
        x: pos.x + 50,
        duration: pos.speed,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Movimento vertical sutil
      this.tweens.add({
        targets: cloud,
        y: pos.y + 10,
        duration: pos.speed / 2,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });
  }

  private createCloud(x: number, y: number): Phaser.GameObjects.Graphics {
    const cloud = this.add.graphics();
    cloud.fillStyle(0xffffff, 1);

    // Nuvem fofa com círculos sobrepostos
    cloud.fillCircle(0, 0, 25);
    cloud.fillCircle(-20, 5, 20);
    cloud.fillCircle(20, 5, 20);
    cloud.fillCircle(-10, -10, 18);
    cloud.fillCircle(10, -10, 18);

    cloud.setPosition(x, y);
    return cloud;
  }

  // ⭐ Estrelas piscando
  private addFloatingStars() {
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(50, 750);
      const y = Phaser.Math.Between(50, 200);
      const star = this.add.image(x, y, "star-sparkle");
      star.setScale(Phaser.Math.FloatBetween(0.15, 0.3));
      star.setAlpha(0.6);

      // Piscando
      this.tweens.add({
        targets: star,
        alpha: { from: 0.3, to: 0.9 },
        scale: { from: star.scale * 0.8, to: star.scale * 1.2 },
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Phaser.Math.Between(0, 2000),
      });

      // Rotação
      this.tweens.add({
        targets: star,
        rotation: Math.PI * 2,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        ease: "Linear",
      });
    }
  }

  // 🦋 Borboletas voando
  private addButterflies() {
    const butterflyColors = [0xff69b4, 0x9370db, 0xffd700];

    for (let i = 0; i < 3; i++) {
      const butterfly = this.createButterfly(butterflyColors[i]);
      const startX = Phaser.Math.Between(100, 700);
      const startY = Phaser.Math.Between(200, 400);
      butterfly.setPosition(startX, startY);
      butterfly.setScale(0.6);

      // Movimento de voo (forma de onda)
      this.tweens.add({
        targets: butterfly,
        x: { from: startX, to: startX + Phaser.Math.Between(-200, 200) },
        y: { from: startY, to: startY + Phaser.Math.Between(-100, 100) },
        duration: Phaser.Math.Between(5000, 8000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Bater de asas
      this.tweens.add({
        targets: butterfly,
        scaleX: { from: 0.5, to: 0.7 },
        duration: 200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  private createButterfly(color: number): Phaser.GameObjects.Graphics {
    const butterfly = this.add.graphics();

    // Corpo
    butterfly.fillStyle(0x000000, 1);
    butterfly.fillEllipse(0, 0, 4, 12);

    // Asas
    butterfly.fillStyle(color, 1);
    butterfly.lineStyle(1, 0x000000, 1);

    // Asa esquerda superior
    butterfly.fillEllipse(-8, -5, 10, 8);
    butterfly.strokeEllipse(-8, -5, 10, 8);

    // Asa esquerda inferior
    butterfly.fillEllipse(-8, 5, 10, 8);
    butterfly.strokeEllipse(-8, 5, 10, 8);

    // Asa direita superior
    butterfly.fillEllipse(8, -5, 10, 8);
    butterfly.strokeEllipse(8, -5, 10, 8);

    // Asa direita inferior
    butterfly.fillEllipse(8, 5, 10, 8);
    butterfly.strokeEllipse(8, 5, 10, 8);

    return butterfly;
  }

  // 🎈 Balões subindo
  private addBalloons() {
    const balloonColors = [0xff6b6b, 0xffd93d, 0x6bc2ff, 0x7cd992, 0xbf7cff];

    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 700);
      const balloon = this.createBalloon(balloonColors[i]);
      balloon.setPosition(x, 650);
      balloon.setScale(0.5);

      // Subir e descer suavemente
      this.tweens.add({
        targets: balloon,
        y: Phaser.Math.Between(350, 500),
        duration: Phaser.Math.Between(8000, 12000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 1500,
      });

      // Balanço lateral
      this.tweens.add({
        targets: balloon,
        x: x + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(2000, 3000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  private createBalloon(color: number): Phaser.GameObjects.Graphics {
    const balloon = this.add.graphics();

    // Corpo do balão
    balloon.fillStyle(color, 1);
    balloon.lineStyle(2, 0x000000, 1);
    balloon.fillEllipse(0, 0, 15, 20);
    balloon.strokeEllipse(0, 0, 15, 20);

    // Brilho
    balloon.fillStyle(0xffffff, 0.4);
    balloon.fillCircle(-5, -8, 5);

    // Cordinha
    balloon.lineStyle(1, 0x8b4513, 1);
    balloon.beginPath();
    balloon.moveTo(0, 20);
    balloon.lineTo(0, 35);
    balloon.strokePath();

    return balloon;
  }

  private startLevel() {
    // Limpa apenas os elementos do nível anterior, preservando HUD (ex.: botão de áudio)
    if (this.levelContainer) {
      this.levelContainer.destroy(true);
    }
    this.levelContainer = this.add.container(0, 0);

    // Toca o som de início da fase somente se o áudio estiver ligado
    if (!this.sound.mute && this.sound.get("formsIntro") === null) {
      // garante que o asset foi carregado e evita sobrepor múltiplas reproduções simultâneas
      this.sound.play("formsIntro", {
        volume: this.registry.has("soundVolume")
          ? this.registry.get("soundVolume")
          : 0.7,
      });
    }

    // Criar trail para efeito de arrasto (fica dentro do container do nível)
    this.dragTrail = this.add.graphics();
    // Mantém a trilha acima do fundo e abaixo das peças
    this.dragTrail.setDepth(12);
    this.levelContainer.add(this.dragTrail);

    // permitir que drop zones recebam eventos de 'drag over'
    this.input.dragDistanceThreshold = 0;
    this.input.topOnly = false;
    // evita handlers duplicados ao reiniciar o nível
    this.input.removeAllListeners("drop");

    const level = this.levels[this.currentLevelIndex];
    const title =
      `${level.getName()}: Arraste as formas até as sombras`.toUpperCase();

    // Título com fundo colorido e animado
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x5b8fff, 0.9);
    titleBg.fillRoundedRect(400 - 370, 30, 740, 60, 30);
    titleBg.lineStyle(4, 0xffffff, 0.8);
    titleBg.strokeRoundedRect(400 - 370, 30, 740, 60, 30);
    this.levelContainer.add(titleBg);

    const titleText = this.add
      .text(400, 60, title, {
        fontSize: "22px",
        color: "#FFFFFF",
        fontFamily: "Arial Black",
        stroke: "#2D5BA8",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    this.levelContainer.add(titleText);

    // Animação do título
    this.tweens.add({
      targets: [titleBg, titleText],
      y: "+=3",
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Estrelinhas decorativas ao redor do título
    for (let i = 0; i < 3; i++) {
      const starLeft = this.add.image(50 + i * 30, 60, "star-sparkle");
      starLeft.setScale(0.25);
      starLeft.setTint(0xffd700);
      this.levelContainer!.add(starLeft);

      const starRight = this.add.image(750 - i * 30, 60, "star-sparkle");
      starRight.setScale(0.25);
      starRight.setTint(0xffd700);
      this.levelContainer!.add(starRight);

      this.tweens.add({
        targets: [starLeft, starRight],
        rotation: Math.PI * 2,
        duration: 3000 + i * 500,
        repeat: -1,
        ease: "Linear",
      });

      this.tweens.add({
        targets: [starLeft, starRight],
        scale: { from: 0.2, to: 0.35 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 200,
      });
    }

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
      // Sombras sempre abaixo das peças
      shadow.setDepth(10);
      this.levelContainer!.add(shadow);
      // Área alvo para hit test
      const targetZone = this.add
        .zone(rightX, y, hitSize, hitSize)
        .setRectangleDropZone(hitSize, hitSize);
      targetZone.setName(`${shadowSpec.type}-zone-${i}`);
      this.levelContainer!.add(targetZone);

      const pieceSpec = shapes[pieceOrder[i]];
      const piece = this.createShapeGraphic(leftX, y, pieceSpec, false, r);
      piece.setName(`${pieceSpec.type}-piece-${i}`);
      // Peças sempre acima das sombras
      piece.setDepth(20);
      this.levelContainer!.add(piece);
      // Definir hit area explícita para permitir eventos em Graphics
      const hitArea = new Phaser.Geom.Rectangle(
        -hitSize / 2,
        -hitSize / 2,
        hitSize,
        hitSize,
      );
      piece.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
      this.input.setDraggable(piece);
      // guardar posição inicial e flags
      piece.setData("homeX", leftX);
      piece.setData("homeY", y);
      piece.setData("isPlaced", false);
      piece.setData("returned", false);
      piece.setData("isShaking", false);

      // Cursor amigável
      piece.on("pointerover", () => this.input.setDefaultCursor("grab"));
      piece.on("pointerout", () => this.input.setDefaultCursor("default"));

      piece.on("dragstart", () => {
        // Garante que a peça fique no topo durante o arrasto
        piece.setDepth(1000);
        this.levelContainer?.bringToTop(piece);
        piece.setAlpha(0.9);
        // reset flags por início de novo arrasto
        piece.setData("returned", false);
        piece.setData("isShaking", false);

        // Limpar trilha anterior
        if (this.dragTrail) {
          this.dragTrail.clear();
        }
      });

      piece.on("drag", (_pointer: any, dragX: number, dragY: number) => {
        piece.setPosition(dragX, dragY);

        // Efeito de trilha brilhante ao arrastar
        if (this.dragTrail) {
          this.dragTrail.lineStyle(8, pieceSpec.color, 0.3);
          this.dragTrail.lineBetween(piece.x - 5, piece.y, piece.x, piece.y);

          // Criar partículas brilhantes
          if (Math.random() > 0.7) {
            this.createSparkle(dragX, dragY, pieceSpec.color);
          }
        }
      });

      piece.on("dragend", () => {
        piece.setAlpha(1);
        // Mantém acima das sombras após soltar
        piece.setDepth(20);

        // Limpar trilha
        if (this.dragTrail) {
          this.tweens.add({
            targets: this.dragTrail,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.dragTrail?.clear();
              if (this.dragTrail) this.dragTrail.alpha = 1;
            },
          });
        }

        // Se não foi colocado corretamente e não está no shake de erro, e ainda não foi retornado
        if (
          !piece.getData("isPlaced") &&
          !piece.getData("isShaking") &&
          !piece.getData("returned")
        ) {
          this.returnToHome(piece);
          piece.setData("returned", true);
        }
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
            piece.setData("isPlaced", true);
            this.placedCount++;
            this.tweenPulse(piece);

            // Efeitos visuais de sucesso!
            this.createSuccessParticles(
              dropZone.x,
              dropZone.y,
              pieceSpec.color,
            );
            this.createStarBurst(dropZone.x, dropZone.y);

            if (this.placedCount === shapes.length) {
              this.time.delayedCall(800, () => {
                // Confetes de celebração!
                this.createConfetti();

                this.time.delayedCall(1500, () => {
                  if (this.currentLevelIndex < this.levels.length - 1) {
                    // Salva o próximo nível no Registry e usa a cena padronizada
                    this.registry.set(
                      "coordNextLevel",
                      this.currentLevelIndex + 1,
                    );
                    this.scene.start("LevelCompleteScene");
                  } else {
                    this.scene.start("EndScene");
                  }
                });
              });
            }
          } else {
            this.sound.play("incorrect");
            // marca que está em animação de erro para não retornar no dragend
            piece.setData("isShaking", true);
            // chacoalha e, ao finalizar, retorna ao ponto de origem
            this.tweenShake(piece, () => {
              this.returnToHome(piece);
              piece.setData("returned", true);
              piece.setData("isShaking", false);
            });
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

  private tweenShake(
    piece: Phaser.GameObjects.Graphics,
    onComplete?: () => void,
  ) {
    this.tweens.add({
      targets: piece,
      x: "+=12",
      duration: 60,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
      onComplete,
    });
  }

  private returnToHome(piece: Phaser.GameObjects.Graphics) {
    const hx = piece.getData("homeX") as number;
    const hy = piece.getData("homeY") as number;
    if (typeof hx === "number" && typeof hy === "number") {
      this.snapTo(piece, hx, hy);
    }
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
    const step = Math.PI / points;
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

  // ✨ Partículas brilhantes ao arrastar
  private createSparkle(x: number, y: number, color: number) {
    const sparkle = this.add.graphics();
    sparkle.fillStyle(color, 0.8);
    sparkle.fillCircle(0, 0, 3);
    sparkle.setPosition(x, y);

    this.tweens.add({
      targets: sparkle,
      alpha: 0,
      scale: 0,
      duration: 500,
      ease: "Cubic.easeOut",
      onComplete: () => sparkle.destroy(),
    });
  }

  // 🎆 Explosão de estrelas quando acerta
  private createStarBurst(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const star = this.add.image(x, y, "star-sparkle");
      star.setScale(0.2);
      star.setTint(0xffd700);

      const distance = 60;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      this.tweens.add({
        targets: star,
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0.4,
        duration: 600,
        ease: "Cubic.easeOut",
        onComplete: () => star.destroy(),
      });

      this.tweens.add({
        targets: star,
        rotation: Math.PI * 2,
        duration: 600,
        ease: "Linear",
      });
    }
  }

  // 💫 Partículas coloridas quando acerta
  private createSuccessParticles(x: number, y: number, color: number) {
    for (let i = 0; i < 12; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(color, 1);
      particle.fillCircle(0, 0, 5);
      particle.setPosition(x, y);

      const angle = Math.random() * Math.PI * 2;
      const speed = Phaser.Math.Between(50, 150);
      const targetX = x + Math.cos(angle) * speed;
      const targetY = y + Math.sin(angle) * speed;

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: { from: 1, to: 0.2 },
        duration: 800,
        ease: "Cubic.easeOut",
        onComplete: () => particle.destroy(),
      });
    }
  }

  // 🎊 Confetes quando completa o nível
  private createConfetti() {
    const colors = [
      0xff6b6b, 0xffd93d, 0x6bc2ff, 0x7cd992, 0xbf7cff, 0xffb6c1, 0xffa500,
    ];

    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, 800);
      const confetti = this.add.graphics();
      const color = Phaser.Utils.Array.GetRandom(colors);

      confetti.fillStyle(color, 1);

      // Diferentes formas de confete
      const shape = Phaser.Math.Between(0, 2);
      if (shape === 0) {
        confetti.fillRect(-5, -5, 10, 10); // quadrado
      } else if (shape === 1) {
        confetti.fillCircle(0, 0, 5); // círculo
      } else {
        confetti.fillTriangle(-5, 5, 0, -5, 5, 5); // triângulo
      }

      confetti.setPosition(x, -20);

      this.tweens.add({
        targets: confetti,
        y: 650,
        duration: Phaser.Math.Between(2000, 4000),
        ease: "Cubic.easeIn",
        onComplete: () => confetti.destroy(),
      });

      this.tweens.add({
        targets: confetti,
        rotation: Math.PI * Phaser.Math.Between(2, 6),
        duration: Phaser.Math.Between(1000, 2000),
        repeat: 2,
        ease: "Linear",
      });

      // Movimento lateral
      this.tweens.add({
        targets: confetti,
        x: x + Phaser.Math.Between(-100, 100),
        duration: Phaser.Math.Between(1500, 3000),
        ease: "Sine.easeInOut",
      });
    }
  }
}
