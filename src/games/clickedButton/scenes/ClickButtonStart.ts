import Phaser from "phaser";
import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";
/**
 * Classe ClickButtonStartScene
 *
 * Gerencia a cena inicial do jogo de clicar em botões.
 * Responsável por carregar dados, imagens e botões do menu inicial, exibir fundo, título e botões de iniciar/sair.
 *
 * Principais responsabilidades:
 * - Carregar assets da tela inicial (JSON, imagens, botões)
 * - Instanciar e exibir fundo, título e botões
 * - Controlar transição para a cena principal do jogo ou saída
 */

export default class ClickButtonStartScene extends Phaser.Scene {
  /** Dados da tela inicial carregados do JSON */
  private startData: any;
  /** Caminho do arquivo JSON da tela inicial */
  private startDataPath: string;
  /** Fábrica de botões para criar botões customizados */
  private buttonFactory: ButtonFactory;

  /**
   * Inicializa a cena inicial do jogo, recebendo o caminho do JSON de dados.
   * @param startDataPath Caminho do arquivo JSON da tela inicial
   */
  constructor(startDataPath: string) {
    super("clickButtonStartScene");
    this.startDataPath = startDataPath;
    this.buttonFactory = new ButtonFactory(new ButtonManager(this));
  }

  /**
   * Pré-carrega o arquivo JSON da tela inicial.
   */
  preload() {
    this.load.json("startData", this.startDataPath);
  }

  /**
   * Cria a cena inicial, carregando dados e assets, exibindo fundo, título e botões de iniciar/sair.
   */
  create() {
    this.startData = this.cache.json.get("startData");

    this.loadBackground();
    this.loadTitle();
    this.loadRectangleBlue();
    this.loadRectangleRed();

    this.load.once("complete", () => {
      this.createBackground();
      this.createTitle();
      this.createStartButton();
      this.createExitButton();
    });

    this.load.start();
  }

  /**
   * Carrega a imagem de fundo da tela inicial.
   */
  private loadBackground() {
    const bgConfig = this.startData.config.background;
    this.load.image("background", bgConfig.image);
  }

  /**
   * Carrega a imagem do título da tela inicial.
   */
  private loadTitle() {
    const titleConfig = this.startData.config.title;
    this.load.image("title", titleConfig.image);
  }

  /**
   * Carrega as imagens dos botões azuis da tela inicial.
   */
  private loadRectangleBlue(): void {
    const textures = this.startData.textures.buttons;
    this.load.image("hoverRectangleBlue", textures.blue.hover);
    this.load.image("defaultRectangleBlue", textures.blue.default);
    this.load.image("clickedRectangleBlue", textures.blue.clicked);
  }

  /**
   * Carrega as imagens dos botões vermelhos da tela inicial.
   */
  private loadRectangleRed(): void {
    const textures = this.startData.textures.buttons;
    this.load.image("hoverRectangleRed", textures.red.hover);
    this.load.image("defaultRectangleRed", textures.red.default);
    this.load.image("clickedRectangleRed", textures.red.clicked);
  }

  /**
   * Cria e exibe a imagem de fundo da tela inicial, ajustando o tamanho à tela.
   */
  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }

  /**
   * Cria e exibe a imagem do título da tela inicial, ajustando o tamanho à tela.
   */
  private createTitle(): void {
    const title = this.add.image(400, 150, "title");
    const scaleX = this.cameras.main.width / title.width;
    const scaleY = this.cameras.main.height / title.height;
    const scale = Math.max(scaleX, scaleY);
    title.setScale(scale / 1.5);
  }

  /**
   * Cria e exibe o botão de iniciar o jogo.
   */
  private createStartButton(): void {
    const buttonContent = this.startData.buttons.start;

    this.buttonFactory.createButton({
      positions: buttonContent.positions,
      textures: {
        default: "defaultRectangleBlue",
        hover: "hoverRectangleBlue",
        clicked: "clickedRectangleBlue",
      },
      text: buttonContent.text,
      fontSize: buttonContent.fontSize,
      onClick: () => {
        this.resetAssets();
        this.scene.start("clickButtonGameScene");
      },
    });
  }

  /**
   * Cria e exibe o botão de sair do jogo.
   */
  private createExitButton(): void {
    const buttonContent = this.startData.buttons.exit;

    this.buttonFactory.createButton({
      positions: buttonContent.positions,
      textures: {
        default: "defaultRectangleRed",
        hover: "hoverRectangleRed",
        clicked: "clickedRectangleRed",
      },
      text: buttonContent.text,
      fontSize: buttonContent.fontSize,
      scale: 0.7,
      onClick: () => {
        this.resetAssets();
        window.history.back();
      },
    });
  }

  /**
   * Remove os assets carregados da tela inicial para liberar memória.
   */
  private resetAssets(): void {
    this.textures.remove("background");
    this.textures.remove("title");
    this.textures.remove("hoverRectangleBlue");
    this.textures.remove("defaultRectangleBlue");
    this.textures.remove("clickedRectangleBlue");
    this.textures.remove("hoverRectangleRed");
    this.textures.remove("defaultRectangleRed");
    this.textures.remove("clickedRectangleRed");
    this.cache.json.remove("startData");
  }
}
