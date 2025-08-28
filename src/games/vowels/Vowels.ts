import { Key } from "lucide-react";
import { EventBus } from "../EventBus";
import Phaser from "phaser";

export default class Vowels extends Phaser.Scene {
  private answers: { [key: string]: string }[] = [];
  private image?: Phaser.GameObjects.Image;
  private level: number;

  public letters: string[] = [];

  constructor() {
    super("Vowels");
    this.level = 0;
    this.answers = [
      {
        key: "abelha",
        answer: "A",
      },
      {
        key: "elefante",
        answer: "E",
      },
    ];
  }

  preload() {
    this.load.image("abelha", "/assets/abelha.svg");
    this.load.image("elefante", "/assets/elefante.svg");
  }

  create() {
    this.image = this.add.image(400, 300, "abelha");
    this.createLevel();

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");
  }

  update() {}

  createLevel() {
    this.letters.push(this.answers[this.level].answer);
    this.letters.push("a");
    this.letters.push("a");
    EventBus.emit("letras-definidas", this.letters);
  }

  changeLevel(letter: string) {
    // Se a imagem atual for a mesma do nome do dicionário
    if (this.image?.texture.key === this.answers[this.level].key) {
      // Se a letra estiver correta
      if (this.answers[this.level].answer === letter) {
        this.level++;
        this.image.setTexture(this.answers[this.level].key);
        console.log("Imagem trocada!");
      }
    }
  }
}
