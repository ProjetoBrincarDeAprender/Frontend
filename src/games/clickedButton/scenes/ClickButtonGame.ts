import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";
import ButtonManager from "../logic/ButtonManager";
import ClickedButtonLevel from "../logic/ClickButtonLevel";
import ClickButtonLogic from "../logic/ClickButtonLogic";
import EffectManager from "../logic/EffectManager";
import LevelManager from "../logic/LevelManager";
/**
 * Classe ClickButtonGameScene
 *
 * Gerencia a cena principal do jogo de clicar em botões.
 * Responsável por carregar dados, imagens, sons e entidades, inicializar gerenciadores e coordenar a exibição dos elementos visuais e interativos.
 *
 * Principais responsabilidades:
 * - Carregar assets (JSON, imagens, sons, entidades)
 * - Instanciar gerenciadores de nível, botões e lógica do jogo
 * - Criar e exibir fundo, questão, entidade, conteúdo e opções
 * - Controlar o fluxo de início e transição entre níveis
 */

export default class ClickButtonGameScene extends PreloadScene {
  /** Dados principais do jogo carregados do JSON */
  private mainData: any;
  /** Caminho do arquivo JSON principal */
  private mainDataPath: string;
  /** Instância da lógica do jogo */
  private clickButtonLogic!: ClickButtonLogic;
  /** Gerenciador de níveis */
  private levelManager!: LevelManager;
  /** Gerenciador de botões */
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;

  /**
   * Inicializa a cena principal do jogo, recebendo o caminho do JSON de dados.
   * @param mainDataPath Caminho do arquivo JSON principal
   */
  constructor(mainDataPath: string) {
    super("clickButtonGameScene");
    this.mainDataPath = mainDataPath;
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
  }

  /**
   * Pré-carrega o arquivo JSON principal do jogo.
   */
  preload() {
    super.preload();
    this.load.json("mainData", this.mainDataPath);
  }

  init() {
    new AudioManager(this);
  }

  /**
   * Cria a cena do jogo, carregando dados e assets, inicializando gerenciadores e exibindo elementos visuais.
   */
  create() {
    this.mainData = this.cache.json.get("mainData");

    this.loadAudios();
    this.loadBackground();
    this.loadButtonImages();
    this.loadEffectsImages();
    this.loadEntitiesImages();

    this.load.once("complete", () => {
      this.setLevelManager();
      this.setLogic();
      this.createBackground();
      this.setupQuestion();
      this.setupContent();
      this.setupOptions();
      this.clickButtonLogic.setActivityId(this.mainData.info.activityId);
    });

    this.load.start();
  }

  /**
   * Carrega os arquivos de áudio definidos nos dados principais.
   */
  private loadAudios() {
    const audios = this.mainData.audios;
    audios.forEach((audio: any) => {
      this.load.audio(audio.key, audio.path);
    });
  }

  /**
   * Carrega a imagem de fundo do jogo.
   */
  private loadBackground(): void {
    this.load.image("background", this.mainData.config.background.image);
  }

  /**
   * Carrega as imagens dos botões utilizados no jogo.
   */
  private loadButtonImages() {
    const buttonTexturesUrl = this.mainData.textures.buttons;

    this.load.image("defaultButton", buttonTexturesUrl.blue.default);
    this.load.image("hoverButton", buttonTexturesUrl.blue.hover);
    this.load.image("clickedButton", buttonTexturesUrl.blue.clicked);

    const whiteButton = buttonTexturesUrl.white;
    if (whiteButton) {
      this.load.image("whiteButton", whiteButton.default);
    } else {
      this.load.image("whiteButton", buttonTexturesUrl.blue.default);
    }
  }

  /**
   * Carrega as imagens dos efeitos visuais utilizados no jogo.
   */
  private loadEffectsImages() {
    const effects = this.mainData.textures.effects;
    effects.forEach((effect: any) => {
      this.load.image(effect.key, effect.texture);
    });
  }

  /**
   * Carrega as imagens das entidades auxiliares utilizadas nos níveis.
   */
  private loadEntitiesImages() {
    const entities = this.mainData.textures.entities;
    if (!entities) return;

    entities.forEach((entity: any) => {
      this.load.image(entity.key, entity.path);
    });
  }

  /**
   * Cria e exibe a imagem de fundo do jogo, ajustando o tamanho à tela.
   */
  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    this.effectManager.overlay(0.4);
    background.setScale(scale);
  }

  /**
   * Inicializa o gerenciador de níveis com os dados carregados.
   */
  private setLevelManager(): void {
    const levels = this.mainData.levels.map(
      (level: any) => new ClickedButtonLevel(level),
    );
    this.levelManager = new LevelManager(levels);

    // Analisa o nível atual salvo no registry
    const actualIndex = this.registry.get("actualIndex");
    if (actualIndex) {
      this.levelManager.setActualIndex(actualIndex);
    } else {
      this.registry.set("actualIndex", 0);
    }
  }

  public static resetRegistry(scene: Phaser.Scene): void {
    scene.registry.set("actualIndex", 0);
  }

  /**
   * Inicializa a lógica do jogo, conectando cena, gerenciador de níveis e botões.
   */
  private setLogic(): void {
    this.clickButtonLogic = new ClickButtonLogic(
      this,
      this.levelManager,
      this.buttonManager,
    );
  }

  /**
   * Exibe o conteúdo/estímulo do nível atual.
   */
  private setupContent(): void {
    this.clickButtonLogic.showContent();
  }

  /**
   * Exibe a pergunta/comando do nível atual.
   */
  private setupQuestion(): void {
    this.clickButtonLogic.showQuestion();
  }

  /**
   * Exibe as opções de resposta do nível atual.
   */
  private setupOptions(): void {
    this.clickButtonLogic.showOptions();
  }
}
