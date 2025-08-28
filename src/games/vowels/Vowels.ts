import { EventBus } from "../EventBus";
import Phaser from "phaser";

export default class Vowels extends Phaser.Scene {
  preload() {
    this.load.image("abelha", "/assets/abelha.svg");
  }

  create() {
    this.add.image(400, 300, "abelha");

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");
  }

  update() {}
}
