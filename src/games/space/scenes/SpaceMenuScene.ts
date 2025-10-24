import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";

export class SpaceMenuScene extends Phaser.Scene {
  private buttonFactory: ButtonFactory;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;

  constructor() {
    super({ key: "SpaceMenuScene" });
    this.buttonManager = new ButtonManager(this);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
    this.effectManager = new EffectManager(this);
  }

  preload() {
    // Botões
    this.load.image(
      "defaultButton",
      "/assets/common/buttons/rectangleBlueDefault.svg",
    );
    this.load.image(
      "hoverButton",
      "/assets/common/buttons/rectangleBlueHover.svg",
    );
    this.load.image(
      "clickedButton",
      "/assets/common/buttons/rectangleBlueClicked.svg",
    );

    this.load.image(
      "defaultButtonRed",
      "/assets/common/buttons/rectangleRedDefault.svg",
    );
    this.load.image(
      "hoverButtonRed",
      "/assets/common/buttons/rectangleRedHover.svg",
    );
    this.load.image(
      "clickedButtonRed",
      "/assets/common/buttons/rectangleRedClicked.svg",
    );

    // Elementos visuais
    this.load.image("mascot", "/assets/spaceGame/mascot.png");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("background", "/assets/spaceGame/background.png");

    this.load.image("planeta1", "/assets/spaceGame/planeta1.png");
    this.load.image("planeta2", "/assets/spaceGame/planeta2.png");
    this.load.image("planeta3", "/assets/spaceGame/planeta3.png");
    this.load.image("lua", "/assets/spaceGame/lua.png");
  }

  create() {
    this.createBackground();
    this.createMascot();
    this.createTitle();
    this.createSubtitle();
    this.createMenuButtons();
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    // Adicionar efeitos se necessário
    this.effectManager.overlay(0.1);
  }

  private createMascot(): void {
    const mascot = this.add
      .image(this.scale.width / 2, 120, "mascot")
      .setScale(0.5);

    const planet1 = this.add.image(100, 200, "planeta1").setScale(0.8);
    const planet2 = this.add.image(700, 250, "planeta2").setScale(0.6);
    const planet3 = this.add.image(50, 400, "planeta3").setScale(0.7);
    const moon = this.add.image(750, 450, "lua").setScale(0.5);

    this.effectManager.addParallax(mascot, 20);
    this.effectManager.addParallax(planet1, 25);
    this.effectManager.addParallax(planet2, 30);
    this.effectManager.addParallax(planet3, 27);
    this.effectManager.addParallax(moon, 23);
  }

  private createTitle(): void {
    this.add
      .text(this.scale.width / 2, 160, "Jogo do Sistema Solar", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "40px",
        color: "#2D5EFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  private createSubtitle(): void {
    this.add
      .text(this.scale.width / 2, 210, "CLIQUE EM COMEÇAR PARA JOGAR!", {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#FFF",
        padding: { left: 10, right: 10, top: 4, bottom: 4 },
      })
      .setOrigin(0.5);
  }

  private createPlayButton(): void {
    this.buttonFactory.createButton({
      positions: {
        x: this.scale.width / 2 - 120,
        y: 300,
      },
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      text: "▶ COMEÇAR",
      fontSize: 24,
      onClick: () => {
        // Resetar progresso quando começar do menu
        this.registry.set("currentSpaceLevel", 0);
        this.scene.start("SpaceGameScene");
      },
    });
  }

  private createExitButton(): void {
    this.buttonFactory.createButton({
      positions: {
        x: this.scale.width / 2 + 120,
        y: 300,
      },
      textures: {
        default: "defaultButtonRed",
        hover: "hoverButtonRed",
        clicked: "clickedButtonRed",
      },
      text: "SAIR",
      fontSize: 24,
      onClick: () => {
        window.history.back();
      },
    });
  }

  private createMenuButtons(): void {
    this.createPlayButton();
    this.createExitButton();
  }

  update() {}
}
