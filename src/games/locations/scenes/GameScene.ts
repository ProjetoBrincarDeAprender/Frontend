import { AudioManager } from "@/games/common/managers/AudioManager";
import Button from "@/games/common/models/Button";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";
import type { LocationLevel } from "../data/LocationsGameData";
import { LocationsGameData } from "../data/LocationsGameData";
import { LocationsGameService } from "../services/LocationsGameService";

export class GameScene extends Phaser.Scene {
  private locationsGameService!: LocationsGameService;
  private currentLevel: number = 0;
  private score: number = 0;

  private questionText!: Phaser.GameObjects.Text;
  private locationImage!: Phaser.GameObjects.Image;
  private optionButtons: Button[] = [];
  private nextButton: Phaser.GameObjects.Container | null = null;
  
  // Elementos para níveis de posicionamento
  private dudaPositionImage: Phaser.GameObjects.Image | null = null;
  private catPositionImage: Phaser.GameObjects.Image | null = null;

  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;
  private answerRevealText: Phaser.GameObjects.Text | null = null;
  private greenAnswerText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data?: { currentLevel?: number; score?: number }) {
    new AudioManager(this, 0.7);

    // Verificar se deve reiniciar o jogo completamente
    const shouldRestart = this.registry.get("locationsRestart");
    
    if (shouldRestart || !data || (data.currentLevel === 0 && data.score === 0)) {
      // Reiniciar completamente o jogo
      this.currentLevel = 0;
      this.score = 0;
      this.registry.remove("locationsCurrentLevel");
      this.registry.remove("locationsScore");
      this.registry.remove("locationsGameCompleted");
      this.registry.remove("locationsRestart");
    } else {
      // Continuar o jogo normalmente
      const registryLevel = this.registry.get("locationsCurrentLevel") || 0;
      const registryScore = this.registry.get("locationsScore") || 0;

      this.currentLevel =
        data?.currentLevel !== undefined ? data.currentLevel : registryLevel;
      this.score = data?.score !== undefined ? data.score : registryScore;

      // Atualiza/persiste no registry
      this.registry.set("locationsCurrentLevel", this.currentLevel);
      this.registry.set("locationsScore", this.score);
    }

    this.locationsGameService = new LocationsGameService();
    this.locationsGameService.setCurrentLevel(this.currentLevel);
    this.optionButtons = [];
    this.isTransitioning = false;
  }

  preload() {
    // Sons
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("wrong", "/assets/common/sounds/incorrect.mp3");
    
    // Botões do AudioManager
    this.load.svg("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.svg("audioOff", "/assets/common/buttons/audioOff.svg");

    // Botões do jogo
    this.load.svg("defaultButton", "/assets/common/buttons/rectangleBlueDefault.svg");
    this.load.svg("hoverButton", "/assets/common/buttons/rectangleBlueHover.svg");
    this.load.svg("clickedButton", "/assets/common/buttons/rectangleBlueClicked.svg");

  // Imagens das localizações (usar loader SVG para preservar vetor)
  this.load.svg("acima", "/assets/locations/acima.svg");
  this.load.svg("abaixo", "/assets/locations/abaixo.svg");
  this.load.svg("dentro", "/assets/locations/dentro.svg");
  this.load.svg("frente", "/assets/locations/frente.svg");
  this.load.svg("lado", "/assets/locations/lado.svg");

    // Personagens
    this.load.image("duda", "/assets/common/duda/girlmainpage.svg");
    this.load.image("duda-lado", "/assets/locations/duda-lado.svg");
    this.load.svg("gato", "/assets/vowelsGame/images/animals/gato.svg");
    this.load.image("gato-locations", "/assets/locations/gato.svg");
  }

  create() {
  // Rosa mais escuro de fundo
  this.cameras.main.setBackgroundColor("#e6f7ff");

    // Adicionar overlay mais escuro sobre o fundo
    // this.add.rectangle(
    //   this.cameras.main.centerX,
    //   this.cameras.main.centerY,
    //   this.cameras.main.width,
    //   this.cameras.main.height,
    //   0x000000,
    //   0.25
    // );

    this.registerStandardScenes();
    
    this.createUI();
    this.startLevel();
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      try {
        const locationsLevelComplete = new LevelCompletedScene({
          nextLevelScene: "GameScene",
          menuScene: "StartScene",
          backgroundPath: "/assets/locations/frente.svg",
          backgroundKey: "locationsBackground",
          onMenuReturn: () => {
            // Limpar todos os registries para reinício completo
            this.registry.remove("locationsCurrentLevel");
            this.registry.remove("locationsScore");
            this.registry.remove("locationsGameCompleted");
            this.registry.set("locationsRestart", true);
          },
        });
        this.scene.add("LevelCompleteScene", locationsLevelComplete);
      } catch (error) {
        console.warn("LevelCompleteScene já existe ou erro ao adicionar:", error);
      }
    }

    if (!this.scene.manager.getScene("EndScene")) {
      try {
        const locationsEndScene = new EndScene({
          restartScene: "StartScene",
          backgroundPath: "/assets/locations/frente.svg",
          backgroundKey: "locationsBackground",
          subtitleMessage: "VOCÊ APRENDEU SOBRE \nLOCALIZAÇÃO ESPACIAL!",
          onRestart: () => {
            // Limpar todos os registries para reinício completo
            this.registry.remove("locationsCurrentLevel");
            this.registry.remove("locationsScore");
            this.registry.remove("locationsGameCompleted");
            this.registry.set("locationsRestart", true);
          },
        });
        this.scene.add("EndScene", locationsEndScene);
      } catch (error) {
        console.warn("EndScene já existe ou erro ao adicionar:", error);
      }
    }
  }

  private createUI(): void {
    // Pergunta
    this.questionText = this.add
      .text(this.cameras.main.centerX, 100, "", {
        fontSize: "36px",
        color: "#2c3e50",
        fontFamily: "Arial",
        wordWrap: { width: 800 },
        align: "center",
      })
      .setOrigin(0.5);

    // Container para imagem da localização - será criado dinamicamente
    // Criação inicial vazia - a imagem será criada no startLevel

    this.createNextButton();
  }

  private startLevel(): void {
    const levelData = LocationsGameData.getLevel(this.currentLevel);
    if (!levelData) {
      this.endGame();
      return;
    }

    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearOptionButtons();
    this.clearPositionElements();

    // Limpar qualquer texto de resposta de nível anterior
    if (this.answerRevealText) {
      (this.answerRevealText as Phaser.GameObjects.Text).destroy();
      this.answerRevealText = null;
    }
    
    // Limpar texto verde da resposta anterior
    if (this.greenAnswerText) {
      this.greenAnswerText.destroy();
      this.greenAnswerText = null;
    }

    // Garantir que a pergunta esteja visível e atualizada
    this.questionText.setText(levelData.question).setVisible(true);
    
    if (levelData.type === 'selection') {
      // Recria a imagem a cada nível para garantir troca de textura e estado limpo
      if (this.locationImage && this.locationImage.scene) {
        this.locationImage.destroy();
      }
      this.locationImage = this.add
        .image(this.cameras.main.centerX, 310, levelData.locationType!)
        .setOrigin(0.5)
        .setScale(0.4) // diminuir tamanho das imagens nos níveis 1-5
        .setVisible(true);

      // Texto de resposta já é limpo no início de startLevel
      
    } else if (levelData.type === 'positioning') {
      // Níveis com Duda e gato (6-10)
      if (this.locationImage) {
        this.locationImage.destroy();
        // @ts-expect-error limpar referência
        this.locationImage = undefined;
      }
      this.createPositionElements(levelData);
    }

    this.createOptionButtons(levelData);

    if (this.nextButton) {
      this.nextButton.setVisible(false);
    }
  }

  private createOptionButtons(level: LocationLevel): void {
    const startY = 500;
    const centerX = this.cameras.main.centerX;

    if (level.type === 'positioning') {
      const spacing = 180;
      
      level.options.forEach((option, index) => {
        const x = centerX + (index === 0 ? -spacing/2 : spacing/2);
        const button = new Button(
          this,
          x,
          startY,
          "defaultButton",
          "hoverButton", 
          "clickedButton",
          option.text,
          24
        );

        button.setScale(0.8);
        this.add.existing(button);

        button.on("pointerdown", () => {
          if (this.buttonsEnabled) {
            this.handleOptionClick(index, level);
          }
        });

        this.optionButtons.push(button);
      });
    } else {
      // Para níveis de seleção, criar 3 botões como antes
      const spacing = 200;
      
      level.options.forEach((option, index) => {
        const x = centerX + (index - 1) * spacing;
        const button = new Button(
          this,
          x,
          startY,
          "defaultButton",
          "hoverButton", 
          "clickedButton",
          option.text,
          24
        );

        button.setScale(0.8);
        this.add.existing(button);

        button.on("pointerdown", () => {
          if (this.buttonsEnabled) {
            this.handleOptionClick(index, level);
          }
        });

        this.optionButtons.push(button);
      });
    }
  }



  private handleOptionClick(selectedIndex: number, level: LocationLevel): void {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    // Desabilitar botões por 2 segundos
    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = this.locationsGameService.isCorrectAnswer(selectedIndex, level);

    // Aplicar feedback visual apenas no botão clicado
    this.optionButtons.forEach((button, index) => {
      button.disableInteractive();
      
      if (index === selectedIndex) {
        button.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }
    });

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.locationsGameService.calculateScore(level);
      this.score += points;
      this.locationsGameService.addScore(points);

      // Só esconder pergunta nos níveis de seleção (1-5)
      if (level.type === 'selection') {
        this.questionText.setVisible(false);
        this.showAnswerReveal(level);
      }
      
      // Só avança para o próximo nível se acertou (delay 3s)
      this.time.delayedCall(3000, () => {
        this.buttonsEnabled = true;
        this.nextLevel();
      });
    } else {
      this.sound.play("wrong", { volume: 0.7 });
      
      // Se errou, apenas reabilita os botões sem avançar (delay 3s p/ leitura)
      this.time.delayedCall(3000, () => {
        this.buttonsEnabled = true;
        this.isTransitioning = false;
        this.resetButtonStates();
      });
    }
  }

  private showAnswerReveal(level: LocationLevel): void {
    // Apenas para níveis de seleção: destaca a opção correta na frase
    if (level.type !== 'selection') return;

    const correctOption = level.options[level.correctAnswer]?.text || "";
    const fullText = level.question.replace("___", correctOption);

    // Destruir antigo se existir
    if (this.answerRevealText) {
      this.answerRevealText.destroy();
      this.answerRevealText = null;
    }

    // Criar texto com resposta na posição da pergunta original
    this.answerRevealText = this.add
      .text(this.cameras.main.centerX, 100, fullText, {
        fontSize: "36px",
        color: "#2c3e50",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5);

    // Aplicar pseudo-destaque verde somente na parte da resposta
    // Como não há rich-text nativo aqui, adicionamos um segundo texto por cima em verde
  const before = level.question.split("___")[0] || "";
    const baseX = this.cameras.main.centerX;
    const baseY = 100;

    // Medidas do texto anterior para posicionar a resposta no meio
    const tempBefore = this.add.text(0, 0, before, { fontSize: "36px", fontFamily: "Arial" }).setVisible(false);
    const tempCorrect = this.add.text(0, 0, correctOption, { fontSize: "36px", fontFamily: "Arial" }).setVisible(false);
    const beforeWidth = tempBefore.width;
    const correctWidth = tempCorrect.width;
    tempBefore.destroy();
    tempCorrect.destroy();

    // Início do texto completo centralizado
    const fullTemp = this.add.text(0, 0, fullText, { fontSize: "36px", fontFamily: "Arial" }).setVisible(false);
    const totalWidth = fullTemp.width;
    fullTemp.destroy();

    const startX = baseX - totalWidth / 2;
    const correctX = startX + beforeWidth + correctWidth / 2;

    // Armazenar referência do texto verde para limpeza posterior
    this.greenAnswerText = this.add
      .text(correctX, baseY, correctOption, {
        fontSize: "36px",
        color: "#16a34a",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.locationsGameService.incrementLevel();

    this.registry.set("locationsCurrentLevel", this.currentLevel);
    this.registry.set("locationsScore", this.score);

    const total = LocationsGameData.getTotalLevels();
    if (this.currentLevel >= total) {
      this.endGame();
    } else if (this.currentLevel === 5) {
      // Mostrar cena de nível completado APÓS terminar nível 5 (índices 0..4). Agora currentLevel=5 aponta para próximo índice.
      this.scene.start("LevelCompleteScene", {
        currentLevel: this.currentLevel, // manter progresso
        totalLevels: total,
        score: this.score,
        gameType: "locations",
        nextScene: "GameScene",
      });
    } else {
      // Para outros níveis, continuar diretamente
      this.startLevel();
    }
  }

  private endGame(): void {
    // Marcar que o jogo foi completado no registry
    this.registry.set("locationsGameCompleted", true);
    
    this.scene.start("EndScene", {
      score: this.score,
      totalLevels: LocationsGameData.getTotalLevels(),
      gameType: "locations",
    });
  }

  private clearOptionButtons(): void {
    this.optionButtons.forEach((button) => button.destroy());
    this.optionButtons = [];
  }

  private resetButtonStates(): void {
    this.optionButtons.forEach((button) => {
      button.clearTint();
      button.setInteractive();
    });
  }

  private clearPositionElements(): void {
    if (this.dudaPositionImage) {
      this.dudaPositionImage.destroy();
      this.dudaPositionImage = null;
    }
    if (this.catPositionImage) {
      this.catPositionImage.destroy();
      this.catPositionImage = null;
    }
  }

  private createPositionElements(level: LocationLevel): void {
    const centerX = this.cameras.main.centerX;
    const centerY = 300;

    // Escolher imagem da Duda baseada no nível
    const dudaKey = (level.id === 8 || level.id === 9) ? "duda-lado" : "duda";
    
    // Criar Duda sempre no centro
    this.dudaPositionImage = this.add
      .image(centerX, centerY, dudaKey)
      .setScale(0.3)
      .setOrigin(0.5);

    // Escolher imagem do gato
    const gatoKey = "gato-locations";

    // Posicionar gato baseado na configuração do nível
    let catX = centerX;
    const catY = centerY;
    
    if (level.catPosition === 'left') {
      catX = centerX - 150;
    } else if (level.catPosition === 'right') {
      catX = centerX + 150;
    } else if (level.catPosition === 'front') {
      catX = centerX - 170;
    } else if (level.catPosition === 'back') {
      catX = centerX + 170;
    }

    this.catPositionImage = this.add
      .image(catX, catY, gatoKey)
      .setScale(0.3)
      .setOrigin(0.5);
  }

  private createNextButton(): void {
    this.nextButton = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.height - 100
    );

    const background = this.add
      .rectangle(0, 0, 150, 50, 0x27ae60);

    const text = this.add
      .text(0, 0, "PRÓXIMO", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.nextButton.add([background, text]);
    this.nextButton.setSize(150, 50);
    this.nextButton.setInteractive();
    this.nextButton.setVisible(false);

    this.nextButton.on("pointerdown", () => {
    //   this.sound.play("click", { volume: 0.5 });
      this.nextLevel();
    });
  }
}
