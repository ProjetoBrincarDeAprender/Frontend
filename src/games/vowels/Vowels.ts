import { EventBus } from "../EventBus";
import { LetterButton } from "./gameObjects/LetterButton";
import Phaser from "phaser";
import Level from "./Level";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;
  private currentlevel: Level;
  private indexCurrentLevel: number;
  private levels: Level[] = [];

  constructor() {
    super("Vowels");
    this.levels.push(new Level("abelha", "A"));
    this.levels.push(new Level("elefante", "E"));

    this.indexCurrentLevel = 0;
    this.currentlevel = this.levels[this.indexCurrentLevel];
  }

  preload() {
    this.load.image("abelha", "/assets/abelha.svg");
    this.load.image("elefante", "/assets/elefante.svg");

    this.load.image("defaultButton", "/assets/defaultButton.svg");
    this.load.image("hoverButton", "/assets/hoverButton.svg");
    this.load.image("clickedButton", "/assets/clickedButton.svg");
  }

  create() {
    // const answer = this.levels[this.currentlevel];

    const button1 = new LetterButton(
      this,
      200,
      500,
      "defaultButton",
      "hoverButton",
      "clickedButton",
      "A",
    );
    const button2 = new LetterButton(
      this,
      400,
      500,
      "defaultButton",
      "hoverButton",
      "clickedButton",
      "B",
    );
    const button3 = new LetterButton(
      this,
      600,
      500,
      "defaultButton",
      "hoverButton",
      "clickedButton",
      "B",
    );

    this.add.existing(button1);
    this.add.existing(button2);
    this.add.existing(button3);

    button1.on("pointerdown", () => {
      this.changeLevel(button1.getLetter());
    });

    button2.on("pointerdown", () => {
      this.changeLevel(button2.getLetter());
    });

    button3.on("pointerdown", () => {
      this.changeLevel(button3.getLetter());
    });

    const firstImage = this.currentlevel.name;
    this.image = this.add.image(400, 300, firstImage);

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");
  }

  update() {}

  changeLevel(letter: string) {
    if (this.image) {
      // Se é a resposta correta do nível em que estamos nesse momento
      if (this.currentlevel.isCorrectLetter(letter)) {
        this.indexCurrentLevel++;
        this.currentlevel = this.levels[this.indexCurrentLevel];
        this.image.setTexture(this.currentlevel.name);
      }
    }
  }
}
