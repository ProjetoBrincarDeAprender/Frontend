/**
 * Classe responsável por gerenciar toda a lógica do jogo de clicar em botões.
 * Controla a exibição de perguntas, entidades, conteúdo, opções, efeitos e sons.
 * Interage com os gerenciadores de nível, botões, efeitos e sons.
 *
 * Principais responsabilidades:
 * - Exibir os elementos do nível atual (questão, entidade, conteúdo, opções)
 * - Gerenciar a interação do usuário com as opções
 * - Aplicar efeitos visuais e sonoros conforme resposta
 * - Controlar o fluxo entre níveis
 */
import LevelManager from "./LevelManager";
import ButtonManager from "./ButtonManager";
import EffectManager from "./EffectManager";
import SoundManager from "./SoundManager";
import type Button from "./Button";

export default class ClickButtonLogic {
  private scene: Phaser.Scene;
  private levelManager: LevelManager;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private soundManager: SoundManager;
  /** Objeto de texto da questão atual */
  private question?: Phaser.GameObjects.Text;
  /** Imagem da entidade auxiliar do nível */
  private entity?: Phaser.GameObjects.Image;
  /** Botões das opções de resposta */
  private options: Button[] = [];
  /** Botões do conteúdo/estímulo do nível */
  private content: Button[] = [];

  /**
   * Inicializa a lógica do jogo, recebendo a cena e os gerenciadores necessários.
   * @param scene Cena principal do Phaser
   * @param levelManager Gerenciador de níveis
   * @param buttonManager Gerenciador de botões
   */
  constructor(
    scene: Phaser.Scene,
    levelManager: LevelManager,
    buttonManager: ButtonManager,
  ) {
    this.scene = scene;
    this.levelManager = levelManager;
    this.buttonManager = buttonManager;
    this.effectManager = new EffectManager(scene);
    this.soundManager = new SoundManager(scene);
  }

  /**
   * Exibe a pergunta/comando do nível atual na tela.
   */
  public showQuestion(): void {
    const text = this.levelManager.getActualLevel().getQuestion();
    this.question = this.scene.add
      .text(400, 80, text, {
        font: "bold 40px Arial",
        color: "#250e00ff",
      })
      .setOrigin(0.5, 0.5);
  }

  /**
   * Exibe a entidade visual (imagem auxiliar) do nível, se existir.
   */
  public showEntity(): void {
    const entityKey = this.levelManager.getActualLevel().getEntityKey();
    if (!entityKey) return;
    this.entity = this.scene.add
      .image(400, 240, entityKey)
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
  }

  /**
   * Exibe o conteúdo/estímulo do nível (ex: sequência, palavra, etc).
   */
  public showContent(): void {
    const content = this.levelManager.getActualLevel().getContent();
    if (!content) return;

    const imageKey = this.levelManager.getActualLevel().getEntityKey();
    let newPositionY, scale;
    if (imageKey) {
      newPositionY = 380;
      scale = 0.8;
    } else {
      newPositionY = 300;
      scale = 1.2;
    }

    const newContent: Button[] = [];
    const spaceBetweenContent = 60;
    let buttonWidth = 20 * scale;
    const totalWidthOccupied =
      (content.length - 1) * spaceBetweenContent + buttonWidth * content.length;
    const startX = (this.scene.cameras.main.width - totalWidthOccupied) / 2;

    for (let i = 0; i < content.length; i++) {
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = this.buttonManager.createButton({
        positions: { x: newPositionX, y: newPositionY },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: content[i],
        fontSize: 40,
        scale: scale,
      });
      newContent.push(contentItem);
    }
    this.content = newContent;
  }

  /**
   * Exibe as opções de resposta do nível e configura os eventos de clique.
   */
  public showOptions(): void {
    const options = this.levelManager.getActualLevel().getOptions();
    const newOptions: Button[] = [];
    const spaceBetweenOptions =
      this.scene.cameras.main.width / (options.length + 1);

    for (let i = 0; i < options.length; i++) {
      const newPositionX = spaceBetweenOptions * (i + 1);
      const option = this.buttonManager.createButton({
        positions: { x: newPositionX, y: 500 },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: options[i],
        fontSize: 40,
        scale: 1.4,
      });
      newOptions.push(option);

      option.off("released");
      option.on("released", () => {
        this.handleOptionClick(option);
      });
    }
    this.options = newOptions;
  }

  /**
   * Lógica de resposta ao clique em uma opção.
   * Aplica efeitos, sons e controla o fluxo do jogo conforme resposta correta ou incorreta.
   * @param selectedOption Botão clicado pelo usuário
   */
  private handleOptionClick(selectedOption: Button): void {
    const answer = this.levelManager.getActualLevel().getAnswer();
    if (selectedOption.getButtonStringText() === answer) {
      this.setOptionsEnabled(false);

      this.effectManager.growup(selectedOption, "expo.out", 1.6, 400);
      this.effectManager.changeColor({
        gameObject: selectedOption,
        color: 0x00ff00,
        duration: 800,
      });
      this.effectManager.starEffect(selectedOption.x, selectedOption.y);
      this.soundManager.play("correct");
      this.updateContentToComplete();
      this.scene.time.delayedCall(3000, () => {
        this.nextLevel();
      });
    } else {
      selectedOption.disableInteractive();

      this.effectManager.growup(selectedOption, "bounce.out", 1.2, 200);
      this.effectManager.changeColor({
        gameObject: selectedOption,
        color: 0xff0000,
        duration: 400,
      });
      this.soundManager.play("incorrect");

      this.scene.time.delayedCall(400, () => {
        selectedOption.setInteractive();
      });
    }
  }

  /**
   * Atualiza o conteúdo do nível para o estado "completo" após resposta correta.
   */
  private updateContentToComplete(): void {
    if (!this.content) return;
    this.content.forEach((text) => text.destroy());
    this.content = [];

    const completeContent = this.levelManager
      .getActualLevel()
      .getCompleteContent();
    if (!completeContent) return;

    const imageKey = this.levelManager.getActualLevel().getEntityKey();
    let newPositionY, scale;
    if (imageKey) {
      newPositionY = 380;
      scale = 0.8;
    } else {
      newPositionY = 300;
      scale = 1.2;
    }

    const newContent: Button[] = [];
    const spaceBetweenContent = 60;
    let buttonWidth = 20 * scale;
    const totalWidthOccupied =
      (completeContent.length - 1) * spaceBetweenContent +
      buttonWidth * completeContent.length;
    const startX = (this.scene.cameras.main.width - totalWidthOccupied) / 2;

    for (let i = 0; i < completeContent.length; i++) {
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = this.buttonManager.createButton({
        positions: { x: newPositionX, y: newPositionY },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: completeContent[i],
        fontSize: 40,
        scale: scale,
      });
      newContent.push(contentItem);
    }
    this.content = newContent;
  }

  /**
   * Limpa todos os elementos visuais do nível atual (questão, entidade, conteúdo, opções).
   */
  private clearLevelElements(): void {
    this.question?.destroy();
    this.entity?.destroy();
    this.content.forEach((text) => text.destroy());
    this.content = [];
    this.options.forEach((option) => option.destroy());
    this.options = [];
  }

  /**
   * Avança para o próximo nível do jogo ou retorna à cena inicial se não houver mais níveis.
   */
  private nextLevel(): void {
    this.clearLevelElements();
    if (!this.levelManager.nextLevel()) {
      this.scene.scene.start("clickButtonStartScene");
    } else {
      this.showQuestion();
      this.showEntity();
      this.showContent();
      this.showOptions();
    }
  }

  /**
   * Habilita ou desabilita a interatividade dos botões de opção.
   * @param enabled Se true, habilita; se false, desabilita.
   */
  private setOptionsEnabled(enabled: boolean): void {
    this.options.forEach((option) => option.disableInteractive());
    if (enabled) {
      this.options.forEach((option) => option.setInteractive());
    }
  }
}
