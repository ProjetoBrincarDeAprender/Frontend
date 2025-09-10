import { EventBus } from "../common/utils/EventBus";
import { LetterButton } from "./gameObjects/LetterButton";
import Phaser from "phaser";
import Level from "./Level";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;
  private currentlevel: Level;
  private indexCurrentLevel: number;
  private levels: Level[] = [];
  private button1: LetterButton | undefined;
  private button2: LetterButton | undefined;
  private button3: LetterButton | undefined;

  private hitTime: number;
  private missCount: number;

  constructor() {
    super("Vowels");
    this.levels.push(new Level("abelha", "A"));
    this.levels.push(new Level("elefante", "E"));

    this.indexCurrentLevel = 0;
    this.currentlevel = this.levels[this.indexCurrentLevel];

    this.hitTime = 0;
    this.missCount = 0;
  }

  preload() {
    this.load.image("abelha", "/assets/vowelsGame/abelha.svg");
    this.load.image("elefante", "/assets/vowelsGame/elefante.svg");

    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  create() {
    let letterArray = this.currentlevel.defineButtonsLetters(3);

    this.button1 = new LetterButton(
      this,
      200,
      500,
      "defaultButton",
      "hoverButton",
      "clickedButton",
    );
    this.button2 = new LetterButton(
      this,
      400,
      500,
      "defaultButton",
      "hoverButton",
      "clickedButton",
    );
    this.button3 = new LetterButton(
      this,
      600,
      500,
      "defaultButton",
      "hoverButton",
      "clickedButton",
    );

    const button1 = this.button1;
    const button2 = this.button2;
    const button3 = this.button3;

    button1.setButtonText(letterArray[0]);
    button2.setButtonText(letterArray[1]);
    button3.setButtonText(letterArray[2]);

    this.add.existing(button1);
    this.add.existing(button2);
    this.add.existing(button3);

    button1.on("pointerdown", () => {
      this.changeLevel(button1.getButtonText());
    });

    button2.on("pointerdown", () => {
      this.changeLevel(button2.getButtonText());
    });

    button3.on("pointerdown", () => {
      this.changeLevel(button3.getButtonText());
    });

    const firstImage = this.currentlevel.getName();
    this.image = this.add.image(400, 300, firstImage);

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");

    this.hitTime = this.time.now;
  }

  update() {}

  changeLevel(letter: string) {
    if (this.image) {
      // Se é a resposta correta do nível em que estamos nesse momento
      if (this.currentlevel.isCorrectLetter(letter)) {
        const initialTime = this.hitTime;
        const finalTime = this.time.now;
        this.hitTime = finalTime - initialTime;
        console.log(this.hitTime);

        console.log(this.missCount);
        this.missCount = 0;

        this.indexCurrentLevel++;

        if (this.indexCurrentLevel >= this.levels.length) {
          this.scene.start("vowelsCredits");
          return;
        }

        this.currentlevel = this.levels[this.indexCurrentLevel];
        this.image.setTexture(this.currentlevel.getName());

        let letterArray = this.currentlevel.defineButtonsLetters(3);
        this.button1?.setButtonText(letterArray[0]);
        this.button2?.setButtonText(letterArray[1]);
        this.button3?.setButtonText(letterArray[2]);
      } else {
        this.missCount++;
      }
    }
  }
}
