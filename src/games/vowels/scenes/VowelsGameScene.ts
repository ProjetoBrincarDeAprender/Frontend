import Logic from "../logic/Logic";
import Phaser from "phaser";

export default class VowelsGameScene extends Phaser.Scene {
  private gameData: any;
  private logic: Logic;

  constructor() {
    super("vowelsGameScene");
    this.logic = new Logic(this);
  }

  preload() {
    this.load.json("mainData", "/assets/vowelsGame/gameData/mainData.JSON");
  }

  create() {
    this.gameData = this.cache.json.get("mainData");

    this.loadAnimalImages();
    this.loadBackgroundImage();
    this.loadButtonImages();
    this.loadSpecialImages();

    this.load.once("complete", () => {
      this.logic.createBackground("backgroundMain");
      this.logic.createImage(this.logic.accessCurrentLevel().getName());
      this.logic.createButtons();
      this.setupLevel();
      console.log("Jogo das vogais carregado!");
    });

    this.load.start();
  }

  update() {}

  private loadAnimalImages() {
    const animals = this.gameData.animalConfig;

    animals.forEach((animal: any) => {
      this.load.image(animal.key, animal.questionTextureUrl);
      this.load.image(animal.completeKey, animal.completeQuestionTextureUrl);
    });
  }

  private loadBackgroundImage(): void {
    this.load.image(
      "backgroundMain",
      this.gameData.backgroundConfig.backgroundUrl,
    );
  }

  private loadButtonImages() {
    this.load.image(
      "defaultButton",
      this.gameData.buttonTexturesUrl.blue.default,
    );
    this.load.image("hoverButton", this.gameData.buttonTexturesUrl.blue.hover);
    this.load.image(
      "clickedButton",
      this.gameData.buttonTexturesUrl.blue.clicked,
    );
  }

  private loadSpecialImages() {
    this.load.image("star", "/assets/common/star.svg");
  }

  private setupLevel() {
    this.logic.setImageTexture(this.logic.accessCurrentLevel().getName());
    this.logic.setButtonTexts();

    this.logic.getButtons().forEach((button) => {
      button.off("pointerdown");
      button.on("pointerdown", () => {
        const result = this.logic.handleClick(button, this.time.now);

        if (result.correct) {
          this.logic.buttonSuccessEffect(button, "star");
          this.time.delayedCall(1000, () => {
            if (result.finished) {
              this.scene.start("vowelsCredits");
            } else {
              this.setupLevel();
            }
          });
        } else {
          this.logic.buttonFailEffect(button);
        }
      });
    });
  }
}
