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
import Phaser from "phaser";
import LevelManager from "./LevelManager";
import ButtonManager from "./ButtonManager";
import EffectManager from "./EffectManager";
import SoundManager from "./SoundManager";
import GameStats from "./GameStats";
import ClickButtonApi from "./ClickButtonApi";
import { ContentRendererFactory } from "../strategies/ContentRendererFactory";
import type { IContentRenderer } from "../strategies/IContentRenderer";
import type Button from "./Button";

export default class ClickButtonLogic {
  private scene: Phaser.Scene;
  private levelManager: LevelManager;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private soundManager: SoundManager;
  private gameStats: GameStats;
  private api: ClickButtonApi;
  private activityId: number;
  private contentRenderer?: IContentRenderer;
  /** Objeto de texto da questão atual */
  private question?: Phaser.GameObjects.Text;
  /** Botões das opções de resposta */
  private options: Button[] = [];

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
    this.api = new ClickButtonApi();
    this.activityId = -1;
    this.gameStats = new GameStats();
    this.gameStats.resetInitialLevelTime(Date.now());
  }

  setActivityId(activityId: number): void {
    this.activityId = activityId;
  }

  /**
   * Exibe a pergunta/comando do nível atual na tela.
   */
  public showQuestion(): void {
    const text = this.levelManager.getActualLevel().getQuestion();
    this.question = this.scene.add
      .text(400, 80, text, {
        font: "bold 40px Arial",
        color: "#fff4c3ff",
      })
      .setOrigin(0.5, 0.5);
  }

  /**
   * Exibe o conteúdo/estímulo do nível usando a estratégia apropriada.
   */
  public showContent(): void {
    const currentLevel = this.levelManager.getActualLevel();
    const renderer = ContentRendererFactory.getRenderer(currentLevel);

    if (renderer) {
      this.contentRenderer = renderer;
      this.contentRenderer.render(currentLevel, this.scene, this.buttonManager);
    }
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
        fontSize: 32,
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
    const timeSpent = this.gameStats.getActualTimeSpent(Date.now());
    this.gameStats.addTimeSpent(timeSpent);

    const answer = this.levelManager.getActualLevel().getAnswer();
    const interaction = {
      studentId: 10130001, // Usuário de teste. Ainda não sabemos como vamos pegar o ID
      activityId: this.activityId,
      questionId: 1, // Questões questionáveis
      // questionId: this.levelManager.getActualIndex() + 1,
      answer: this.levelManager.getActualLevel().getAnswer(),
      timeSpent: timeSpent,
      attempts: 1,
      neededHint: false,
      // responseDate: 0,
      isCorrect: selectedOption.getButtonStringText() === answer,
    };

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
      try {
        this.soundManager.play(
          this.levelManager.getActualLevel().getEntityKey(),
        );
      } catch (err) {}
      this.updateContentToComplete();
      this.scene.time.delayedCall(3000, () => {
        this.nextLevel();
        this.gameStats.resetInitialLevelTime(Date.now());
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
        this.gameStats.resetInitialLevelTime(Date.now());
      });
    }

    this.api.sendGameData(interaction);
  }

  /**
   * Atualiza o conteúdo do nível para o estado "completo" após resposta correta.
   */
  private updateContentToComplete(): void {
    if (!this.contentRenderer) return;

    const currentLevel = this.levelManager.getActualLevel();
    this.contentRenderer.updateToComplete(
      currentLevel,
      this.scene,
      this.buttonManager,
    );
  }

  /**
   * Limpa todos os elementos visuais do nível atual (questão, conteúdo, opções).
   */
  private clearLevelElements(): void {
    this.question?.destroy();
    this.contentRenderer?.clear();
    this.options.forEach((option) => option.destroy());
    this.options = [];
  }

  /**
   * Avança para o próximo nível do jogo ou retorna à cena inicial se não houver mais níveis.
   */
  private nextLevel(): void {
    this.clearLevelElements();
    this.levelManager.nextLevel();
    this.scene.registry.set("actualIndex", this.levelManager.getActualIndex());

    if (this.levelManager.isFinished()) {
      this.scene.registry.set("actualIndex", 0);
      this.scene.scene.start("EndScene");
    } else if (this.isMileStone()) {
      this.scene.scene.start("LevelCompleteScene");
    } else {
      this.showQuestion();
      this.showContent();
      this.showOptions();
    }
  }

  private isMileStone(): boolean {
    const actualIndex = this.scene.registry.get("actualIndex");
    const allLevels = this.levelManager.getLevels();
    if (actualIndex < allLevels.length - 1 && actualIndex % 5 === 0) {
      return true;
    }
    return false;
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
