import { AudioManager } from "@/games/common/managers/AudioManager";
import { BgManager } from "@/games/common/managers/BgManager";
import ButtonManager from "@/games/common/managers/ButtonManager";
import Phaser from "phaser";
import { HistoryData } from "../logic/PlantsHistoryData";

export class PlantsHistoryScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private buttonManager!: ButtonManager;
  private bgManager!: BgManager;
  private contentContainer?: Phaser.GameObjects.Container;
  private buttonsContainer?: Phaser.GameObjects.Container;
  private mascot?: Phaser.GameObjects.Image;
  private currentAudio?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "PlantsHistoryScene" });
    this.buttonManager = new ButtonManager(this);
    this.bgManager = new BgManager(this);
  }

  init() {
    this.registry.set("currentChat", 0);
    this.audioManager = new AudioManager(this);
  }

  preload() {
    this.load.image("background", "/assets/plantsGame/background.png");
    this.load.image("mascot", "/assets/plantsGame/mascot.png");

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

    HistoryData.forEach(({ image }, index) => {
      if (image != null) {
        this.load.image("infoImage_" + index, image.path);
      }
      this.load.audio(
        "infoAudio_" + index,
        "/assets/plantsGame/history/lines/" + "line" + (index + 1) + ".m4a",
      );
    });
  }

  create() {
    this.bgManager.createBackground("background");

    this.createMascot();

    this.setupContent();
  }

  private setupContent(): void {
    // Limpar conteúdo anterior (mas manter o background)
    this.clearContent();

    // Criar novos containers
    this.contentContainer = this.add.container(0, 0);
    this.buttonsContainer = this.add.container(0, 0);

    // Criar o conteúdo
    this.handleChats();
    this.createButtons();
  }

  private clearContent(): void {
    // Parar áudio atual se estiver tocando
    if (this.currentAudio && this.currentAudio.isPlaying) {
      this.currentAudio.stop();
    }

    if (this.contentContainer) {
      this.contentContainer.destroy();
      this.contentContainer = undefined;
    }

    if (this.buttonsContainer) {
      this.buttonsContainer.destroy();
      this.buttonsContainer = undefined;
    }
  }

  private createChatBubble(width: number, height: number, text: string): void {
    const speechBubbleContainer = this.add.container(this.scale.width / 2, 70);

    const speechBubble = this.add.graphics();
    const bubbleWidth = width;
    const bubbleHeight = height;
    const cornerRadius = 20;

    speechBubble.fillStyle(0xffffff, 1);
    speechBubble.lineStyle(4, 0x2d5aa0, 1);
    speechBubble.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      cornerRadius,
    );
    speechBubble.strokeRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      cornerRadius,
    );

    // Desenhar a "cauda" do balão
    speechBubble.fillStyle(0xffffff, 1);
    speechBubble.lineStyle(4, 0x2d5aa0, 1);

    // Calcular a posição da cauda apontando para o mascote
    const mascotX = this.mascot?.getTopCenter().x || 100; // posição X do mascote
    const mascotY = this.mascot?.getTopCenter().y || 200; // posição Y do mascote
    const bubbleCenterX = this.scale.width / 2;
    const bubbleCenterY = 70;

    // Ponto na borda do balão mais próximo do mascote
    const tailBaseX = -bubbleWidth / 2 + 50;
    const tailBaseY = bubbleHeight / 2;

    // Ponto da cauda apontando para o mascote
    const tailTipX = mascotX - bubbleCenterX;
    const tailTipY = mascotY - bubbleCenterY + 50;

    const tailPoints = [
      tailBaseX - 20,
      tailBaseY,
      tailTipX,
      tailTipY,
      tailBaseX + 20,
      tailBaseY,
    ];

    speechBubble.fillTriangle(
      tailPoints[0],
      tailPoints[1],
      tailPoints[2],
      tailPoints[3],
      tailPoints[4],
      tailPoints[5],
    );
    speechBubble.strokeTriangle(
      tailPoints[0],
      tailPoints[1],
      tailPoints[2],
      tailPoints[3],
      tailPoints[4],
      tailPoints[5],
    );

    speechBubbleContainer.add(speechBubble);

    const speechText = this.add
      .text(0, 0, text, {
        fontSize: "24px",
        color: "#000000",
        fontFamily: "Arial Black",
        align: "center",
        wordWrap: { width: bubbleWidth - 40 },
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    speechBubbleContainer.add(speechText);

    // Adicionar ao container principal
    if (this.contentContainer) {
      this.contentContainer.add(speechBubbleContainer);
    }
  }

  private createMascot(): void {
    // Criar mascot apenas uma vez
    if (!this.mascot) {
      this.mascot = this.add.image(100, 350, "mascot").setScale(0.5);
    }
  }

  private createImage(): void {
    const currentChat = this.registry.get("currentChat") as number;
    const imageKey = `infoImage_${currentChat}`;

    if (!this.textures.exists(imageKey)) {
      this.load.image(imageKey, HistoryData[currentChat].image?.path as string);
      this.load.start();
    }

    const infoImage = this.add
      .image(400, 300, imageKey)
      .setScale(HistoryData[currentChat].image?.scale || 1);

    // Adicionar ao container principal
    if (this.contentContainer) {
      this.contentContainer.add(infoImage);
    }
  }

  private playCurrentAudio(): void {
    const currentChat = this.registry.get("currentChat") as number;
    const audioKey = `infoAudio_${currentChat}`;

    // Parar áudio anterior se estiver tocando
    if (this.currentAudio && this.currentAudio.isPlaying) {
      this.currentAudio.stop();
    }

    try {
      // Tocar novo áudio
      this.currentAudio = this.sound.add(audioKey, { volume: 0.7 });

      if (this.currentAudio) {
        this.currentAudio.play();

        // Quando o áudio terminar, mostrar os botões
        this.currentAudio.once("complete", () => {
          this.showButtons();
        });

        // Tratamento para caso o áudio seja interrompido
        this.currentAudio.once("stop", () => {
          this.showButtons();
        });
      } else {
        // Se não conseguir criar o áudio, mostrar botões imediatamente
        this.showButtons();
      }
    } catch (error) {
      // Se houver erro ao carregar/tocar o áudio, mostrar botões imediatamente
      console.warn(`Áudio ${audioKey} não encontrado ou erro ao tocar:`, error);
      this.showButtons();
    }
  }

  private showButtons(): void {
    if (this.buttonsContainer) {
      this.buttonsContainer.setVisible(true);
    }
  }

  private hideButtons(): void {
    if (this.buttonsContainer) {
      this.buttonsContainer.setVisible(false);
    }
  }

  private handleChats(): void {
    const currentChat = this.registry.get("currentChat") as number;
    const chatData = HistoryData[currentChat];

    this.createChatBubble(this.scale.width - 100, 120, chatData.text);

    if (chatData.image) {
      this.createImage();
    }

    // Esconder os botões inicialmente
    this.hideButtons();

    // Tocar o áudio do chat atual
    this.playCurrentAudio();
  }

  private handleNext(): void {
    if (this.registry.get("currentChat") < HistoryData.length - 1) {
      this.registry.set("currentChat", this.registry.get("currentChat") + 1);
      this.setupContent(); // Recria todo o conteúdo
    } else {
      // Limpar o progresso antes de iniciar o jogo
      this.registry.set("currentSpaceProgress", {
        levelIndex: 0,
        questionIndex: 0,
      });

      // Parar áudio antes de trocar de cena
      if (this.currentAudio && this.currentAudio.isPlaying) {
        this.currentAudio.stop();
      }

      this.mascot?.destroy();
      this.mascot = undefined;
      this.scene.start("PlantsGameScene");
    }
  }

  private handlePrevious(): void {
    if (this.registry.get("currentChat") > 0) {
      this.registry.set("currentChat", this.registry.get("currentChat") - 1);
      this.setupContent(); // Recria todo o conteúdo
    }
  }

  private createButtons(): void {
    const currentChat = this.registry.get("currentChat") as number;

    // Botão Anterior
    if (currentChat > 0) {
      const previousBtn = this.buttonManager.createButton({
        positions: {
          x: this.scale.width / 2 - 150,
          y: 550,
        },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: "ANTERIOR",
        fontSize: 20,
      });

      previousBtn.on("pointerdown", () => {
        this.handlePrevious();
        this.audioManager.playSound("");
      });

      previousBtn.setTint(0x00aa00);

      if (this.buttonsContainer) {
        this.buttonsContainer.add(previousBtn);
      }
    }

    const isLastChat = currentChat >= HistoryData.length - 1;
    const nextBtn = this.buttonManager.createButton({
      positions: {
        x: this.scale.width / 2 + 150,
        y: 550,
      },
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      text: isLastChat ? "JOGAR" : "PRÓXIMO",
      fontSize: 20,
    });

    nextBtn.on("pointerdown", () => {
      this.handleNext();
    });

    nextBtn.setTint(0x00aa00);

    if (this.buttonsContainer) {
      this.buttonsContainer.add(nextBtn);
    }

    // Botão pequeno para pular no canto inferior direito
    const skipBtn = this.add
      .rectangle(
        this.scale.width - 10,
        this.scale.height - 10,
        10,
        10,
        0x666666,
        0.7,
      )
      .setInteractive();

    // Adicionar texto "PULAR" no botão
    const skipText = this.add
      .text(this.scale.width - 10, this.scale.height - 10, "PULAR", {
        fontSize: "6px",
        color: "#ffffff",
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5);

    // Efeitos hover
    skipBtn.on("pointerover", () => {
      skipBtn.setAlpha(0.9);
    });

    skipBtn.on("pointerout", () => {
      skipBtn.setAlpha(0.7);
    });

    // Ação do botão pular - vai direto para o jogo
    skipBtn.on("pointerdown", () => {
      // Limpar o progresso antes de iniciar o jogo
      this.registry.set("currentSpaceProgress", {
        levelIndex: 0,
        questionIndex: 0,
      });

      // Parar áudio antes de trocar de cena
      if (this.currentAudio && this.currentAudio.isPlaying) {
        this.currentAudio.stop();
      }

      this.mascot?.destroy();
      this.mascot = undefined;
      this.scene.start("PlantsGameScene");
    });

    if (this.buttonsContainer) {
      this.buttonsContainer.add([skipBtn, skipText]);
    }
  }

  shutdown() {
    // Limpar áudio quando a cena for destruída
    if (this.currentAudio && this.currentAudio.isPlaying) {
      this.currentAudio.stop();
    }
  }

  update() {}
}
