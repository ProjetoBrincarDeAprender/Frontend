import { EventBus } from "../EventBus";
import Phaser from "phaser";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;

  constructor() {
    super("Vowels");
  }

  preload() {
    this.load.image("abelha", "/assets/abelha.svg");
    this.load.image("elefante", "/assets/elefante.svg");
  }

  create() {
    this.image = this.add.image(400, 300, "abelha");

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");
  }

  update() {}

  changeImage() {
    if (this.image?.texture.key === "abelha") {
      this.image.setTexture("elefante");
    } else {
      this.image?.setTexture("abelha");
    }
    console.log("imagem trocada");
  }
}
