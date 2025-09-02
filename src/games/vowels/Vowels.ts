import { EventBus } from "../EventBus";
import { LetterButton } from "./gameObjects/LetterButton";
import Phaser from "phaser";
import Level from "./Level";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;
  private currentlevel: number;
  private levels: Level[] = [];

  constructor() {
    super("Vowels");
    this.currentlevel = 0;
    this.levels.push(new Level("abelha", "A"));
    this.levels.push(new Level("elefante", "E"));
  }

  preload() {
    this.load.image("abelha", "/assets/abelha.svg");
    this.load.image("elefante", "/assets/elefante.svg");

    this.load.image("defaultButton", "/assets/defaultButton.svg");
    this.load.image("hoverButton", "/assets/hoverButton.svg");
    this.load.image("clickedButton", "/assets/clickedButton.svg");
  }

  create() {
    var firstImage = this.levels[this.currentlevel].name;
    this.image = this.add.image(400, 300, firstImage);

    const button = new LetterButton(this, 400, 300, "defaultButton");
    this.add.existing(button);

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");
  }

  update() {}

  recreateLevel() {
    const newLetters = [this.levels[this.currentlevel].answer, "a", "a"];
    EventBus.emit("letras-definidas", newLetters);
  }

  changeLevel(letter: string) {
    // Se a imagem atual for a mesma do nome do dicionário
    if (this.image?.texture.key === this.levels[this.currentlevel].name) {
      // Se a letra estiver correta
      if (this.levels[this.currentlevel].answer === letter) {
        this.currentlevel++;
        this.image.setTexture(this.levels[this.currentlevel].name);
        this.recreateLevel();
        console.log("Imagem trocada!");
      }
    }
  }
}
