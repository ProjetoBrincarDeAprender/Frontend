import { AudioManager as GlobalAudioManager } from "@/games/common/managers/AudioManager";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";
import { ArmedSumLevel } from "../ArmedSumLevel";
import { ArmedSumLogic } from "../ArmedSumLogic";

export class GameScene extends Phaser.Scene {
  private logic!: ArmedSumLogic;
  private currentLevel: ArmedSumLevel | null = null;
  private currentDigitIndex: number = 0; // Posição atual (0 = unidades, 1 = dezenas, etc)
  private userAnswer: string[] = []; // Resposta do usuário (da direita para esquerda)
  private answerTexts: Phaser.GameObjects.Text[] = []; // Textos da resposta
  private answerBoxes: Phaser.GameObjects.Rectangle[] = []; // Caixas dos algarismos
  private optionButtons: Phaser.GameObjects.Container[] = [];
  private isTransitioning: boolean = false;

  constructor() {
    super({ key: "GameScene" });
  }

  init(): void {
    new GlobalAudioManager(this, 0.7);
    this.registerStandardScenes();
    this.currentDigitIndex = 0;
    this.userAnswer = [];
    this.answerTexts = [];
    this.answerBoxes = [];
    this.optionButtons = [];
    this.isTransitioning = false;
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      const levelComplete = new LevelCompletedScene({
        nextLevelScene: "GameScene",
        menuScene: "StartScene",
        backgroundPath: "/assets/armedSum/background.png",
        backgroundKey: "armedSumBg",
        levelTitle: "NÍVEL COMPLETO!",
        onMenuReturn: () => {
          this.registry.remove("armedSumCurrentLevel");
        },
      });
      this.scene.add("LevelCompleteScene", levelComplete);
    }

    if (!this.scene.manager.getScene("EndScene")) {
      const endScene = new EndScene({
        restartScene: "StartScene",
        backgroundPath: "/assets/armedSum/background.png",
        backgroundKey: "armedSumBg",
        subtitleMessage: "VOCÊ DOMINOU AS CONTAS ARMADAS!",
        onRestart: () => {
          this.registry.remove("armedSumCurrentLevel");
        },
      });
      this.scene.add("EndScene", endScene);
    }
  }

  preload(): void {
    this.load.image("armedSumBg", "/assets/armedSum/background.png");
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
  }

  create(): void {
    const bg = this.add.image(400, 300, "armedSumBg");
    bg.setDisplaySize(800, 600);

    this.initializeLogic();
    this.startLevel();
  }

  private initializeLogic(): void {
    const levels: ArmedSumLevel[] = [];

    // Nível 1: 5 fases com 2 dígitos
    for (let i = 0; i < 5; i++) {
      levels.push(new ArmedSumLevel(2));
    }

    // Nível 2: 5 fases com 3 dígitos
    for (let i = 0; i < 5; i++) {
      levels.push(new ArmedSumLevel(3));
    }

    // Nível 3: 5 fases com 4 dígitos
    for (let i = 0; i < 5; i++) {
      levels.push(new ArmedSumLevel(4));
    }

    const savedLevel = this.registry.get("armedSumCurrentLevel") || 0;
    const userId = this.registry.get("armedSumUserId") || "10130001";
    const activityId = this.registry.get("armedSumActivityId") || 4;

    this.logic = new ArmedSumLogic(
      this,
      levels,
      userId,
      activityId,
      savedLevel,
    );
  }

  private startLevel(): void {
    this.currentDigitIndex = 0;
    this.userAnswer = [];
    this.answerTexts = [];
    this.answerBoxes = [];
    this.optionButtons = [];
    this.isTransitioning = false;
    this.currentLevel = this.logic.getCurrentLevel();

    if (!this.currentLevel) return;

    this.createLevelDisplay();
  }

  private createLevelDisplay(): void {
    if (!this.currentLevel) return;

    const { width } = this.cameras.main;

    // Título do nível
    this.add
      .text(
        width / 2,
        50,
        `Nível ${this.logic.getCurrentLevelNumber()}/${this.logic.getTotalLevels()}`,
        {
          fontSize: "28px",
          color: "#2c3e50",
          fontFamily: "Arial",
          fontStyle: "bold",
          stroke: "#FFFFFF",
          strokeThickness: 4,
        },
      )
      .setOrigin(0.5);

    // Conta armada
    const numberA = this.currentLevel.getNumberA().toString();
    const numberB = this.currentLevel.getNumberB().toString();
    const answer = this.currentLevel.getAnswer().toString();
    const answerDigits = answer.split("");
    const maxLength = Math.max(numberA.length, numberB.length, answer.length);

    // Espaçamento entre dígitos
    const digitSpacing = 50;
    const totalWidth = maxLength * digitSpacing;
    const startX = width / 2 - totalWidth / 2;

    // Posição Y da conta
    const equationY = 150;
    const lineY = equationY + 100;
    const answerY = lineY + 20;

    // Exibir numberA com espaçamento
    const digitsA = numberA.padStart(maxLength, " ").split("");
    for (let i = 0; i < digitsA.length; i++) {
      if (digitsA[i] !== " ") {
        this.add
          .text(
            startX + i * digitSpacing + digitSpacing / 2,
            equationY,
            digitsA[i],
            {
              fontSize: "48px",
              color: "#2c3e50",
              fontFamily: "Arial",
              fontStyle: "bold",
            },
          )
          .setOrigin(0.5);
      }
    }

    // Exibir numberB com sinal +
    const digitsB = numberB.padStart(maxLength, " ").split("");
    for (let i = 0; i < digitsB.length; i++) {
      if (digitsB[i] !== " ") {
        this.add
          .text(
            startX + i * digitSpacing + digitSpacing / 2,
            equationY + 50,
            digitsB[i],
            {
              fontSize: "48px",
              color: "#2c3e50",
              fontFamily: "Arial",
              fontStyle: "bold",
            },
          )
          .setOrigin(0.5);
      }
    }

    // Sinal de +
    this.add
      .text(startX - 30, equationY + 50, "+", {
        fontSize: "48px",
        color: "#2c3e50",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Linha separadora
    const lineGraphics = this.add.graphics();
    lineGraphics.lineStyle(4, 0x2c3e50);
    lineGraphics.beginPath();
    lineGraphics.moveTo(startX - 20, lineY);
    lineGraphics.lineTo(startX + totalWidth + 20, lineY);
    lineGraphics.strokePath();

    // Criar quadradinhos para a resposta
    for (let i = 0; i < answerDigits.length; i++) {
      const x = startX + i * digitSpacing + digitSpacing / 2;

      // Caixa (quadradinho)
      const box = this.add.rectangle(x, answerY + 30, 45, 55, 0xffffff);
      box.setStrokeStyle(3, 0x3498db);
      this.answerBoxes.push(box);

      // Texto dentro da caixa
      const text = this.add
        .text(x, answerY + 30, "", {
          fontSize: "42px",
          color: "#2c3e50",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.answerTexts.push(text);
    }

    // Destacar o quadradinho atual (da direita para esquerda)
    this.updateCurrentBoxHighlight();

    // Criar as 3 opções para o primeiro dígito (unidades - direita)
    this.createDigitOptions();
  }

  private createDigitOptions(): void {
    if (!this.currentLevel) return;

    // Limpar botões anteriores
    this.optionButtons.forEach((btn) => btn.destroy());
    this.optionButtons = [];

    const { width, height } = this.cameras.main;
    const answer = this.currentLevel.getAnswer().toString();
    const answerDigits = answer.split("");

    // Índice da direita para esquerda (0 = unidades, 1 = dezenas, etc)
    const digitIndex = answerDigits.length - 1 - this.currentDigitIndex;
    const correctDigit = parseInt(answerDigits[digitIndex]);

    // Gerar 3 opções únicas
    const options = this.generateOptions(correctDigit);

    // Posições dos botões
    const buttonWidth = 120;
    const spacing = 40;
    const totalWidth = 3 * buttonWidth + 2 * spacing;
    const startX = width / 2 - totalWidth / 2 + buttonWidth / 2;
    const y = height * 0.7;

    for (let i = 0; i < options.length; i++) {
      const x = startX + i * (buttonWidth + spacing);
      const option = options[i];
      const button = this.createOptionButton(x, y, option, correctDigit);
      this.optionButtons.push(button);
    }
  }

  private updateCurrentBoxHighlight(): void {
    // Resetar todas as caixas para cor padrão
    this.answerBoxes.forEach((box) => {
      box.setStrokeStyle(3, 0x3498db);
    });

    // Destacar a caixa atual (lembrar: índice visual é da esquerda pra direita)
    const answer = this.currentLevel!.getAnswer().toString();
    const visualIndex = answer.length - 1 - this.currentDigitIndex;

    if (this.answerBoxes[visualIndex]) {
      this.answerBoxes[visualIndex].setStrokeStyle(4, 0xe67e22); // Laranja para destaque

      // Animação de pulso na caixa atual
      this.tweens.add({
        targets: this.answerBoxes[visualIndex],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  private generateOptions(correctDigit: number): number[] {
    const options = new Set<number>();
    options.add(correctDigit);

    // Adicionar 2 opções incorretas
    while (options.size < 3) {
      const randomDigit = Phaser.Math.Between(0, 9);
      options.add(randomDigit);
    }

    // Embaralhar
    return Phaser.Utils.Array.Shuffle(Array.from(options));
  }

  private createOptionButton(
    x: number,
    y: number,
    digit: number,
    correctDigit: number,
  ): Phaser.GameObjects.Container {
    const button = this.add.rectangle(0, 0, 120, 80, 0x3498db);
    button.setStrokeStyle(4, 0x2980b9);
    button.setInteractive({ useHandCursor: true });

    const text = this.add
      .text(0, 0, digit.toString(), {
        fontSize: "48px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const container = this.add.container(x, y, [button, text]);

    button.on("pointerover", () => {
      button.setFillStyle(0x5dade2);
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
      });
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x3498db);
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
      });
    });

    button.on("pointerdown", () => {
      if (this.isTransitioning) return;

      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.handleDigitSelection(digit, correctDigit);
        },
      });
    });

    return container;
  }

  private handleDigitSelection(
    selectedDigit: number,
    correctDigit: number,
  ): void {
    if (selectedDigit !== correctDigit) {
      // Resposta errada
      this.sound.play("incorrect");
      this.cameras.main.shake(300, 0.01);

      // Piscar a caixa atual em vermelho
      const answer = this.currentLevel!.getAnswer().toString();
      const visualIndex = answer.length - 1 - this.currentDigitIndex;

      this.tweens.add({
        targets: this.answerBoxes[visualIndex],
        alpha: 0.3,
        duration: 150,
        yoyo: true,
        repeat: 2,
      });

      return;
    }

    // Resposta correta
    this.sound.play("correct");
    this.userAnswer.push(selectedDigit.toString());

    // Atualizar display da resposta (lembrar que visualmente é da esquerda pra direita)
    const answer = this.currentLevel!.getAnswer().toString();
    const answerDigits = answer.split("");
    const visualIndex = answerDigits.length - 1 - this.currentDigitIndex;

    // Parar animação da caixa atual
    this.tweens.killTweensOf(this.answerBoxes[visualIndex]);
    this.answerBoxes[visualIndex].setScale(1);

    // Preencher o texto
    this.answerTexts[visualIndex].setText(selectedDigit.toString());
    this.answerTexts[visualIndex].setColor("#27ae60");

    // Mudar cor da caixa para verde
    this.answerBoxes[visualIndex].setStrokeStyle(3, 0x27ae60);

    this.currentDigitIndex++;

    // Verificar se completou todos os dígitos
    if (this.currentDigitIndex >= answerDigits.length) {
      // Completou - montar resposta completa (inverter porque userAnswer foi preenchido da direita pra esquerda)
      const fullAnswer = this.userAnswer.reverse().join("");

      console.log("🎮 RESPOSTA COMPLETA:", fullAnswer);

      // Enviar resposta para o logic
      this.logic.checkAnswer(fullAnswer);

      this.isTransitioning = true;
      this.cameras.main.flash(300, 0, 255, 0);

      this.time.delayedCall(500, () => {
        const hasNext = this.logic.nextLevel();
        if (!hasNext) {
          // Fim do jogo
          this.scene.start("EndScene");
        } else {
          // Verificar se deve mostrar tela de próximo nível (mudança de dificuldade)
          const currentLevel = this.logic.getCurrentLevelNumber();

          // Mostrar LevelCompleteScene apenas nos níveis 5 e 10 (mudança de dificuldade)
          // Nível 5: terminou 2 dígitos, vai para 3 dígitos
          // Nível 10: terminou 3 dígitos, vai para 4 dígitos
          if (currentLevel === 5 || currentLevel === 10) {
            this.scene.start("LevelCompleteScene");
          } else {
            // Continuar direto para o próximo nível
            this.scene.restart();
          }
        }
      });
    } else {
      // Próximo dígito - atualizar destaque
      this.updateCurrentBoxHighlight();
      this.createDigitOptions();
    }
  }
}
