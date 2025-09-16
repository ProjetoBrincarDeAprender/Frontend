import Phaser from "phaser";
import { EventBus } from "@/games/common/utils/EventBus";

export default class Vowels extends Phaser.Scene {
  constructor() {
    super("vowelsStart");
  }

  preload() {
    this.load.image("start_screen", "/assets/vowelsGame/start_screen.svg");
  }

  create() {
    // Coloca a imagem centralizada
    const img = this.add.image(400, 300, "start_screen");
    img.setDisplaySize(800, 600);

    // Texto complementar (para interação acessível)
    const startText = this.add
      .text(400, 480, "Clique para começar", {
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

    // Pequena animação para chamar atenção
    this.tweens.add({
      targets: startText,
      y: 470,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Emite evento para informar que a cena está pronta
    EventBus.emit("current-scene-ready", "StartScene pronta");

    // Ao clicar na tela, inicia a cena do jogo
    this.input.once("pointerdown", () => {
      this.scene.start("vowelsGameScene");
    });
  }

  update() {}
}
