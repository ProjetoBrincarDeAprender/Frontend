import { AudioManager } from "@/games/common/managers/AudioManager";
import Phaser from "phaser";
import MazeLevel, {
  type LevelData,
  type ShapeConfig,
} from "../logic/MazeLevel";
import { MazeApiService } from "../services/MazeApiService";

export default class MazeGameScene extends Phaser.Scene {
  private levels: MazeLevel[] = [];
  private currentLevelIndex = 0;
  private shape!: Phaser.GameObjects.Graphics;
  private shapeBody!: Phaser.Physics.Matter.Sprite;
  private target!: Phaser.GameObjects.Graphics;
  private walls: Phaser.GameObjects.Rectangle[] = [];
  private wallBodies: any[] = [];
  private dangerBodies: any[] = [];
  private isDragging = false;
  private startPos = { x: 0, y: 0 };

  // Tracking de dados para envio ao backend
  private apiService!: MazeApiService;
  private levelStartTime: number = 0;
  private currentAttempts: number = 0;
  private activityId: number = 2; // ID da atividade do jogo do labirinto

  constructor() {
    super({ key: "MazeGameScene" });
  }

  init(data: { startLevel?: number } = {}) {
    // Permite iniciar pelo próximo nível salvo no Registry quando vindo da cena comum
    const regNext = this.registry.get("mazeNextLevel");
    this.currentLevelIndex =
      data.startLevel ?? (typeof regNext === "number" ? regNext : 0);
    // Limpa o valor para evitar reaproveitar em reinícios
    this.registry.set("mazeNextLevel", null);
    new AudioManager(this);

    // Pega o activityId do registry se disponível
    const registryActivityId = this.registry.get("activityId");
    if (registryActivityId) {
      this.activityId = registryActivityId;
    }

    // Inicializa o serviço de API
    this.apiService = new MazeApiService(this, this.activityId);
  }

  preload() {
    // Carregar dados dos níveis
    this.load.json("mazeLevels", "/assets/maze/gameData/levelsData.JSON");

    // Sons
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
    this.load.image("star-sparkle", "/assets/common/star.svg");
  }

  create() {
    this.matter.world.setBounds(0, 0, 800, 600);

    const levelsData = this.cache.json.get("mazeLevels");
    this.levels = levelsData.levels.map(
      (data: LevelData) => new MazeLevel(data),
    );

    this.addBackground();
    this.startLevel();
  }

  private addBackground() {
    // Gradiente de fundo suave
    const g = this.add.graphics();
    g.fillGradientStyle(0xe0f6ff, 0xe0f6ff, 0xc5e3f6, 0xc5e3f6, 1);
    g.fillRect(0, 0, 800, 600);

    // Decorações
    this.addDecorations();
  }

  private addDecorations() {
    // Estrelas decorativas nos cantos
    const positions = [
      { x: 50, y: 50 },
      { x: 750, y: 50 },
      { x: 50, y: 550 },
      { x: 750, y: 550 },
    ];

    positions.forEach((pos, i) => {
      const star = this.add.image(pos.x, pos.y, "star-sparkle");
      star.setScale(0.3);
      star.setTint(0xffd700);
      star.setAlpha(0.6);

      this.tweens.add({
        targets: star,
        rotation: Math.PI * 2,
        duration: 4000 + i * 500,
        repeat: -1,
        ease: "Linear",
      });
    });
  }

  private startLevel() {
    // Reseta tracking do nível
    this.levelStartTime = Date.now();
    this.currentAttempts = 0;

    // Limpar elementos anteriores
    this.walls.forEach((wall) => wall.destroy());
    this.walls = [];
    this.wallBodies.forEach((body) => this.matter.world.remove(body));
    this.wallBodies = [];
    this.dangerBodies.forEach((body) => this.matter.world.remove(body));
    this.dangerBodies = [];
    if (this.shape) this.shape.destroy();
    if (this.shapeBody) {
      this.matter.world.remove(this.shapeBody as any);
      this.shapeBody = null as any;
    }
    if (this.target) this.target.destroy();

    // (Sem som de introdução específico nesta cena)

    const level = this.levels[this.currentLevelIndex];

    // Título
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x5b8fff, 0.9);
    titleBg.fillRoundedRect(150, 10, 500, 50, 25);
    titleBg.lineStyle(3, 0xffffff, 0.8);
    titleBg.strokeRoundedRect(150, 10, 500, 50, 25);

    this.add
      .text(400, 35, `NÍVEL ${level.getId()}: ARRASTE ATÉ A SOMBRA`, {
        fontSize: "22px",
        color: "#FFFFFF",
        fontFamily: "Arial Black",
        stroke: "#2D5BA8",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Criar paredes
    this.createWalls(level);

    // Criar zonas perigosas (invisíveis)
    this.createDangerZones(level);

    // Criar alvo (sombra)
    this.createTarget(level);

    // Criar forma arrastável
    this.createShape(level);

    // Configurar posição inicial
    const startPos = level.getStartPosition();
    this.startPos = { x: startPos.x, y: startPos.y };
    this.resetShapePosition();
  }

  private createWalls(level: MazeLevel) {
    const walls = level.getWalls();

    walls.forEach((wallData) => {
      // Visual da parede
      const wall = this.add.rectangle(
        wallData.x + wallData.width / 2,
        wallData.y + wallData.height / 2,
        wallData.width,
        wallData.height,
        0x8b4513,
      );
      wall.setStrokeStyle(2, 0x654321);

      // Física da parede
      const wallBody = this.matter.add.rectangle(
        wallData.x + wallData.width / 2,
        wallData.y + wallData.height / 2,
        wallData.width,
        wallData.height,
        { isStatic: true, label: "wall" },
      );

      this.walls.push(wall);
      this.wallBodies.push(wallBody);
    });
  }

  // Cria zonas perigosas invisíveis, que contam como erro ao tocar
  private createDangerZones(level: MazeLevel) {
    const zones = level.getDangerZones();
    zones.forEach((dz: any) => {
      const body = this.matter.add.rectangle(
        dz.x + dz.width / 2,
        dz.y + dz.height / 2,
        dz.width,
        dz.height,
        { isStatic: true, label: "danger" },
      );
      this.dangerBodies.push(body);
      // Nenhum elemento visual é adicionado — permanecem invisíveis
    });
  }

  private createTarget(level: MazeLevel) {
    const targetPos = level.getTargetPosition();
    const shapeConfig = level.getShape();

    this.target = this.add.graphics();
    this.target.setPosition(targetPos.x, targetPos.y);

    // Desenhar sombra da forma
    this.target.fillStyle(0x1f2937, 0.6);
    this.target.lineStyle(3, 0x111827, 0.8);

    this.drawShape(this.target, shapeConfig, 0, 0);

    // Animação de pulsação
    this.tweens.add({
      targets: this.target,
      scale: { from: 0.95, to: 1.05 },
      alpha: { from: 0.5, to: 0.7 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Zona de detecção
    const zone = this.add.zone(
      targetPos.x,
      targetPos.y,
      shapeConfig.size * 2.5,
      shapeConfig.size * 2.5,
    );
    zone.setData("isTarget", true);
  }

  private createShape(level: MazeLevel) {
    const shapeConfig = level.getShape();
    const startPos = level.getStartPosition();

    // Criar representação visual
    this.shape = this.add.graphics();
    this.shape.setPosition(startPos.x, startPos.y);

    const color = Phaser.Display.Color.HexStringToColor(
      shapeConfig.color,
    ).color;
    this.shape.fillStyle(color, 1);
    this.shape.lineStyle(3, 0x000000, 1);

    this.drawShape(this.shape, shapeConfig, 0, 0);

    // Efeito de brilho
    this.shape.fillStyle(0xffffff, 0.3);
    this.drawHighlight(this.shape, shapeConfig);

    // Criar corpo físico com Matter.js
    let shapeBody;
    switch (shapeConfig.type) {
      case "circle":
        shapeBody = this.matter.add.circle(
          startPos.x,
          startPos.y,
          shapeConfig.size,
          {
            restitution: 0,
            friction: 0,
            frictionAir: 0.05,
            label: "shape",
          },
        );
        break;
      case "square":
      case "rectangle":
        const width =
          shapeConfig.type === "square"
            ? shapeConfig.size * 2
            : shapeConfig.size * 2.4;
        const height =
          shapeConfig.type === "square"
            ? shapeConfig.size * 2
            : shapeConfig.size * 1.4;
        shapeBody = this.matter.add.rectangle(
          startPos.x,
          startPos.y,
          width,
          height,
          {
            restitution: 0,
            friction: 0,
            frictionAir: 0.05,
            label: "shape",
          },
        );
        break;
      case "triangle":
        // Aproximação com polígono
        const r = shapeConfig.size;
        const vertices = [
          { x: 0, y: -r },
          { x: r, y: r },
          { x: -r, y: r },
        ];
        shapeBody = this.matter.add.fromVertices(
          startPos.x,
          startPos.y,
          vertices as any,
          {
            restitution: 0,
            friction: 0,
            frictionAir: 0.05,
            label: "shape",
          },
        );
        break;
      default:
        shapeBody = this.matter.add.circle(
          startPos.x,
          startPos.y,
          shapeConfig.size,
          {
            restitution: 0,
            friction: 0,
            frictionAir: 0.05,
            label: "shape",
          },
        );
    }

    this.shapeBody = shapeBody as any;

    // Configurar eventos de colisão
    this.matter.world.on("collisionstart", (event: any) => {
      event.pairs.forEach((pair: any) => {
        if (
          (pair.bodyA.label === "shape" || pair.bodyB.label === "shape") &&
          (pair.bodyA.label === "wall" ||
            pair.bodyB.label === "wall" ||
            pair.bodyA.label === "danger" ||
            pair.bodyB.label === "danger")
        ) {
          if (this.isDragging) {
            this.onWallCollision();
          }
        }
      });
    });

    // Eventos de input
    this.shape.setInteractive(
      new Phaser.Geom.Circle(0, 0, shapeConfig.size * 1.5),
      Phaser.Geom.Circle.Contains,
    );

    this.input.setDraggable(this.shape);

    this.shape.on("pointerover", () => this.input.setDefaultCursor("grab"));
    this.shape.on("pointerout", () => this.input.setDefaultCursor("default"));

    this.shape.on("dragstart", () => {
      this.isDragging = true;
      this.shape.setAlpha(0.8);
      this.input.setDefaultCursor("grabbing");
    });

    this.shape.on("drag", (_pointer: any, dragX: number, dragY: number) => {
      this.matter.body.setPosition(this.shapeBody as any, {
        x: dragX,
        y: dragY,
      });
      this.matter.body.setVelocity(this.shapeBody as any, { x: 0, y: 0 });
      this.shape.setPosition(dragX, dragY);
    });

    this.shape.on("dragend", (_pointer: any) => {
      this.isDragging = false;
      this.shape.setAlpha(1);
      this.input.setDefaultCursor("default");

      // Verificar se chegou no alvo
      const distance = Phaser.Math.Distance.Between(
        this.shape.x,
        this.shape.y,
        this.target.x,
        this.target.y,
      );

      if (distance < shapeConfig.size * 1.5) {
        this.onSuccess();
      } else {
        this.returnToStart();
      }
    });
  }

  private drawShape(
    g: Phaser.GameObjects.Graphics,
    config: ShapeConfig,
    x: number,
    y: number,
  ) {
    const r = config.size;

    g.beginPath();
    switch (config.type) {
      case "circle":
        g.fillCircle(x, y, r);
        break;
      case "square":
        g.fillRoundedRect(x - r, y - r, r * 2, r * 2, 8);
        break;
      case "rectangle":
        g.fillRoundedRect(x - r * 1.2, y - r * 0.7, r * 2.4, r * 1.4, 8);
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
    g.strokePath();
  }

  private drawHighlight(g: Phaser.GameObjects.Graphics, config: ShapeConfig) {
    const r = config.size * 0.3;
    const offsetX = -config.size * 0.3;
    const offsetY = -config.size * 0.3;

    switch (config.type) {
      case "circle":
        g.fillCircle(offsetX, offsetY, r);
        break;
      case "square":
      case "rectangle":
        g.fillRoundedRect(offsetX, offsetY, r * 1.5, r, 5);
        break;
      case "triangle":
        g.fillTriangle(
          offsetX - r * 0.5,
          offsetY + r * 0.3,
          offsetX,
          offsetY - r * 0.5,
          offsetX + r * 0.3,
          offsetY,
        );
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
    const step = Math.PI / points;
    g.moveTo(x, y - outerRadius);

    for (let i = 0; i < points; i++) {
      g.lineTo(
        x + Math.cos(rot) * outerRadius,
        y + Math.sin(rot) * outerRadius,
      );
      rot += step;
      g.lineTo(
        x + Math.cos(rot) * innerRadius,
        y + Math.sin(rot) * innerRadius,
      );
      rot += step;
    }

    g.lineTo(x, y - outerRadius);
    g.closePath();
    g.fillPath();
  }

  private onWallCollision() {
    this.sound.play("incorrect");

    // Incrementa tentativas e envia dados ao errar
    this.currentAttempts++;
    this.sendErrorData();

    // Efeito visual de erro
    this.cameras.main.shake(200, 0.005);

    this.tweens.add({
      targets: this.shape,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.returnToStart();
      },
    });
  }

  private returnToStart() {
    this.isDragging = false;

    this.tweens.add({
      targets: this.shape,
      x: this.startPos.x,
      y: this.startPos.y,
      duration: 300,
      ease: "Back.easeOut",
      onUpdate: () => {
        this.matter.body.setPosition(this.shapeBody as any, {
          x: this.shape.x,
          y: this.shape.y,
        });
        this.matter.body.setVelocity(this.shapeBody as any, { x: 0, y: 0 });
      },
    });
  }

  private resetShapePosition() {
    this.shape.setPosition(this.startPos.x, this.startPos.y);
    this.matter.body.setPosition(this.shapeBody as any, {
      x: this.startPos.x,
      y: this.startPos.y,
    });
    this.matter.body.setVelocity(this.shapeBody as any, { x: 0, y: 0 });
  }

  private onSuccess() {
    this.sound.play("correct");
    this.isDragging = false;

    // Envia dados de sucesso
    this.sendSuccessData();

    // Efeitos visuais de sucesso
    this.createSuccessEffect();

    // Desabilitar interação
    this.shape.disableInteractive();

    // Animação de encaixe
    this.tweens.add({
      targets: this.shape,
      x: this.target.x,
      y: this.target.y,
      scale: 1.1,
      duration: 300,
      ease: "Back.easeOut",
      onUpdate: () => {
        this.matter.body.setPosition(this.shapeBody as any, {
          x: this.shape.x,
          y: this.shape.y,
        });
      },
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          if (this.currentLevelIndex < this.levels.length - 1) {
            // Salva o próximo nível no Registry e usa a cena padronizada
            this.registry.set("mazeNextLevel", this.currentLevelIndex + 1);
            this.scene.start("LevelCompleteScene");
          } else {
            this.scene.start("EndScene");
          }
        });
      },
    });
  }

  private createSuccessEffect() {
    // Partículas coloridas
    const colors = [0xff6b6b, 0xffd93d, 0x6bc2ff, 0x7cd992, 0xbf7cff];

    for (let i = 0; i < 15; i++) {
      const particle = this.add.graphics();
      const color = Phaser.Utils.Array.GetRandom(colors);
      particle.fillStyle(color, 1);
      particle.fillCircle(0, 0, 5);
      particle.setPosition(this.target.x, this.target.y);

      const angle = (i / 15) * Math.PI * 2;
      const distance = 80;

      this.tweens.add({
        targets: particle,
        x: this.target.x + Math.cos(angle) * distance,
        y: this.target.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.3,
        duration: 600,
        ease: "Cubic.easeOut",
        onComplete: () => particle.destroy(),
      });
    }

    // Estrelas
    for (let i = 0; i < 6; i++) {
      const star = this.add.image(this.target.x, this.target.y, "star-sparkle");
      star.setScale(0.2);
      star.setTint(0xffd700);

      const angle = (i / 6) * Math.PI * 2;
      const distance = 70;

      this.tweens.add({
        targets: star,
        x: this.target.x + Math.cos(angle) * distance,
        y: this.target.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.5,
        rotation: Math.PI * 2,
        duration: 800,
        ease: "Cubic.easeOut",
        onComplete: () => star.destroy(),
      });
    }
  }

  // 📊 Métodos de envio de dados
  private async sendErrorData() {
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - this.levelStartTime) / 1000); // em segundos

    const gameData = {
      questionId: this.currentLevelIndex + 1, // Níveis começam em 1
      attempts: this.currentAttempts,
      timeSpent: timeSpent,
      isCorrect: false, // Erro ao colidir com parede
      neededHint: false,
    };

    await this.apiService.sendGameData(gameData);
  }

  private async sendSuccessData() {
    const currentTime = Date.now();
    const timeSpent = Math.floor((currentTime - this.levelStartTime) / 1000);

    const gameData = {
      questionId: this.currentLevelIndex + 1,
      attempts: this.currentAttempts,
      timeSpent: timeSpent,
      isCorrect: true, // Sucesso ao chegar no alvo!
      neededHint: false,
    };

    await this.apiService.sendGameData(gameData);
  }
}
