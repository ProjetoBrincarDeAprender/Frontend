import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import Phaser from "phaser";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import LevelManager from "../../common/managers/LevelManager";
import SpaceApiService from "../service/spaceApiService";
import SpaceLevel from "./SpaceLevel";

export default class SpaceLogic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private levelManager!: LevelManager<SpaceLevel>;
  private buttonFactory: ButtonFactory;
  private questionText!: Phaser.GameObjects.Text;
  private buttons: (
    | Button
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Text
  )[] = [];
  private buttonsEnabled: boolean = true;
  private apiService!: SpaceApiService;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameStats = new GameStats();
    this.buttonManager = new ButtonManager(this.scene);
    this.effectManager = new EffectManager(this.scene);
    this.buttonFactory = new ButtonFactory(this.buttonManager);

    // Garantir que os botões iniciem habilitados
    this.buttonsEnabled = true;
  }

  getCurrentLevel(): SpaceLevel {
    return this.levelManager.getCurrentLevel();
  }

  setLevelManager(levels: SpaceLevel[]) {
    this.levelManager = new LevelManager(levels);

    // Inicializar o serviço de API
    this.apiService = new SpaceApiService(
      this.scene,
      this.levelManager,
      this.gameStats,
    );

    // Restaurar progresso se existir
    const savedLevel = this.scene.registry.get("currentSpaceLevel");
    if (savedLevel && savedLevel > 0) {
      // Avançar para o nível salvo
      for (let i = 0; i < savedLevel; i++) {
        this.levelManager.nextLevel();
      }
    }
  }

  createBackground(): void {
    const background = this.scene.add.image(400, 300, "background");
    const scaleX = this.scene.cameras.main.width / background.width;
    const scaleY = this.scene.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    this.effectManager.overlay(0.2);
  }

  createQuestion(): void {
    const currentLevel = this.getCurrentLevel();

    this.questionText = this.scene.add
      .text(this.scene.scale.width / 2, 120, currentLevel.getQuestion(), {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "32px",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
        wordWrap: { width: this.scene.scale.width - 100 },
      })
      .setOrigin(0.5);
  }

  createButtons(): void {
    const currentLevel = this.getCurrentLevel();
    const originalOptions = currentLevel.getOptions();
    const originalOptionsImages = currentLevel.getOptionsImages();
    const hasImages = currentLevel.hasImages();

    // Garantir que os botões estejam habilitados
    this.buttonsEnabled = true;

    // Criar arrays de índices para embaralhar
    const indices = Array.from({ length: originalOptions.length }, (_, i) => i);
    this.shuffleArray(indices);

    // Aplicar o shuffle nas opções e imagens
    const options = indices.map((i) => originalOptions[i]);
    const optionsImages = originalOptionsImages
      ? indices.map((i) => originalOptionsImages[i])
      : null;

    // Limpar botões anteriores
    this.buttons.forEach((button) => {
      if (button && typeof button.destroy === "function") {
        button.destroy();
      }
    });
    this.buttons = [];

    const buttonWidth = 180;
    const spacing = 30;
    const totalWidth =
      options.length * buttonWidth + (options.length - 1) * spacing;
    const startX = (this.scene.scale.width - totalWidth) / 2 + buttonWidth / 2;
    const buttonY = this.scene.scale.height / 2 + 80;

    options.forEach((option, index) => {
      const x = startX + index * (buttonWidth + spacing);

      if (hasImages && optionsImages) {
        // Para questões com imagens, criar apenas a imagem clicável sem fundo
        const imageKey = optionsImages[index].replace(".png", "");
        const showNames = currentLevel.getDifficulty() === "medium";

        const planetImage = this.scene.add
          .image(x, showNames ? buttonY - 20 : buttonY, imageKey)
          .setScale(0.7)
          .setInteractive();

        let planetText: Phaser.GameObjects.Text | null = null;

        // Adicionar o nome do planeta embaixo da imagem apenas para dificuldade medium
        if (showNames) {
          planetText = this.scene.add
            .text(x, buttonY + 45, option.toUpperCase(), {
              fontFamily: "Comic Sans MS, Arial, sans-serif",
              fontSize: "16px",
              color: "#FFFFFF",
              fontStyle: "bold",
              stroke: "#000000",
              strokeThickness: 2,
            })
            .setOrigin(0.5);

          // Fazer o texto também clicável
          planetText.setInteractive();
          planetText.on("pointerdown", () => this.handleButtonClick(option));
        }

        // Fazer a imagem clicável
        planetImage.on("pointerdown", () => this.handleButtonClick(option));

        // Adicionar efeitos hover na imagem
        planetImage.on("pointerover", () => {
          planetImage.setScale(0.75);
          planetImage.setTint(0xdddddd);
          if (planetText) planetText.setScale(1.1);
        });
        planetImage.on("pointerout", () => {
          planetImage.setScale(0.7);
          planetImage.clearTint();
          if (planetText) planetText.setScale(1.0);
        });

        // Adicionar efeitos hover no texto (apenas se existir)
        if (planetText) {
          planetText.on("pointerover", () => {
            planetImage.setScale(0.75);
            planetImage.setTint(0xdddddd);
            planetText.setScale(1.1);
          });
          planetText.on("pointerout", () => {
            planetImage.setScale(0.7);
            planetImage.clearTint();
            planetText.setScale(1.0);
          });

          // Armazenar referência do texto para limpeza posterior
          this.buttons.push(planetText);
        }

        // Armazenar referência da imagem para limpeza posterior
        this.buttons.push(planetImage);
      } else {
        // Para questões só com texto, usar botão normal
        const button = this.buttonFactory.createButton({
          positions: { x, y: buttonY },
          textures: {
            default: "defaultButton",
            hover: "hoverButton",
            clicked: "clickedButton",
          },
          text: option,
          fontSize: 24,
          scale: 0.8,
          onClick: () => this.handleButtonClick(option),
        });

        this.buttons.push(button);
      }
    });
  }

  private handleButtonClick(selectedOption: string): void {
    // Verificar se os botões estão habilitados
    if (!this.buttonsEnabled) {
      return;
    }

    // Bloquear todos os botões imediatamente
    this.buttonsEnabled = false;

    const currentLevel = this.getCurrentLevel();
    const isCorrect = currentLevel.isCorrectAnswer(selectedOption);

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  private handleCorrectAnswer(): void {
    // Efeito visual de sucesso
    this.scene.sound.play("correct", { volume: 0.7 });

    // Adicionar estatísticas
    this.gameStats.addHitTime(this.scene.time.now);
    this.gameStats.addMissCount(); // Registrar os misses do nível atual
    this.gameStats.resetInitialLevelTime(this.scene.time.now);
    this.gameStats.resetActualLevelMisses(); // Resetar para o próximo nível

    // Enviar dados do nível para a API
    this.apiService.sendLevelData();

    // Mostrar feedback positivo
    this.showFeedback("Correto! 🎉", "#00FF00");

    // Ir para tela de conclusão após um delay
    this.scene.time.delayedCall(3500, () => {
      const currentLevel = this.levelManager.getCurrentIndex();
      const hasNextLevel = this.levelManager.nextLevel();
      const isLastLevel = !hasNextLevel;

      // Salvar o progresso no registry para persistir entre cenas
      this.scene.registry.set(
        "currentSpaceLevel",
        this.levelManager.getCurrentIndex(),
      );

      if (isLastLevel) {
        // Se é o último nível, enviar dados de conclusão do jogo
        this.apiService.sendGameCompletionData();

        // Ir diretamente para a cena final
        this.scene.scene.start("SpaceEndScene");
      } else {
        // Se não é o último nível, ir para a cena de nível completo
        this.scene.scene.start("SpaceLevelCompleteScene", {
          level: currentLevel,
          isLastLevel: false,
        });
      }
    });
  }

  private handleWrongAnswer(): void {
    // Efeito visual de erro
    this.scene.sound.play("incorrect", { volume: 0.7 });

    // Adicionar estatísticas
    this.gameStats.addMiss();

    // Mostrar feedback negativo
    this.showFeedback("Tente novamente! 🤔", "#FF0000", true);
  }

  private showFeedback(
    text: string,
    color: string,
    reactivateButtons: boolean = false,
  ): void {
    const feedback = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 50,
        text,
        {
          fontFamily: "Comic Sans MS, Arial, sans-serif",
          fontSize: "28px",
          color: color,
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        },
      )
      .setOrigin(0.5);

    // Animar entrada do feedback
    this.scene.tweens.add({
      targets: feedback,
      scaleX: { from: 0, to: 1.2 },
      scaleY: { from: 0, to: 1.2 },
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Manter o feedback visível e depois animar saída
        this.scene.time.delayedCall(2800, () => {
          this.scene.tweens.add({
            targets: feedback,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            ease: "Back.easeIn",
            onComplete: () => {
              feedback.destroy();
              // Reativar botões se necessário (para respostas erradas)
              if (reactivateButtons) {
                this.buttonsEnabled = true;
              }
            },
          });
        });
      },
    });
  }

  setupLevel(): void {
    // Reativar botões para a nova pergunta
    this.buttonsEnabled = true;

    // Atualizar pergunta
    if (this.questionText) {
      this.questionText.destroy();
    }
    this.createQuestion();

    // Recriar botões
    this.createButtons();
  }

  isGameFinished(): boolean {
    return this.levelManager.isFinished();
  }

  getGameStats(): GameStats {
    return this.gameStats;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
