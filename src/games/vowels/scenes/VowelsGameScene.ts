import Logic from "../logic/Logic";
import Phaser from "phaser";

export default class VowelsGameScene extends Phaser.Scene {
  private logic: Logic;

  constructor() {
    super("vowelsGameScene");
    this.logic = new Logic(this);
  }

  preload() {
    this.loadAnimalImages();
    this.loadBackgroundImage();
    this.loadButtonImages();
    this.loadSpecialImages();
  }

  create() {
    this.logic.createBackground("backgroundMain");
    this.logic.createImage(this.logic.accessCurrentLevel().getName());
    this.logic.createButtons();
    this.setupLevel();

    console.log("Jogo das vogais carregado!");
  }

  update() {}

  private loadAnimalImages() {
    this.load.image("abelha", "/assets/vowelsGame/animals/abelha.svg");
    this.load.image(
      "abelhaCompleta",
      "/assets/vowelsGame/animals/abelhaCompleta.svg",
    );

    this.load.image("elefante", "/assets/vowelsGame/animals/elefante.svg");
    this.load.image(
      "elefanteCompleta",
      "/assets/vowelsGame/animals/elefanteCompleta.svg",
    );

    this.load.image("hiena", "/assets/vowelsGame/animals/hiena.svg");
    this.load.image(
      "hienaCompleta",
      "/assets/vowelsGame/animals/hienaCompleta.svg",
    );

    this.load.image("ovelha", "/assets/vowelsGame/animals/ovelha.svg");
    this.load.image(
      "ovelhaCompleta",
      "/assets/vowelsGame/animals/ovelhaCompleta.svg",
    );

    this.load.image("urso", "/assets/vowelsGame/animals/urso.svg");
    this.load.image(
      "ursoCompleta",
      "/assets/vowelsGame/animals/ursoCompleta.svg",
    );

    this.load.image("gato", "/assets/vowelsGame/animals/gato.svg");
    this.load.image(
      "gatoCompleta",
      "/assets/vowelsGame/animals/gatoCompleta.svg",
    );

    this.load.image("esquilo", "/assets/vowelsGame/animals/esquilo.svg");
    this.load.image(
      "esquiloCompleta",
      "/assets/vowelsGame/animals/esquiloCompleta.svg",
    );

    this.load.image("iguana", "/assets/vowelsGame/animals/iguana.svg");
    this.load.image(
      "iguanaCompleta",
      "/assets/vowelsGame/animals/iguanaCompleta.svg",
    );

    this.load.image("onca", "/assets/vowelsGame/animals/onca.svg");
    this.load.image(
      "oncaCompleta",
      "/assets/vowelsGame/animals/oncaCompleta.svg",
    );

    this.load.image("urubu", "/assets/vowelsGame/animals/urubu.svg");
    this.load.image(
      "urubuCompleta",
      "/assets/vowelsGame/animals/urubuCompleta.svg",
    );
  }

  private loadBackgroundImage(): void {
    this.load.image(
      "backgroundMain",
      "/assets/vowelsGame/images/backgroundMain.png",
    );
  }

  private loadButtonImages() {
    this.load.image(
      "defaultButton",
      "/assets/common/buttons/squareBlueDefault.svg",
    );
    this.load.image(
      "hoverButton",
      "/assets/common/buttons/squareBlueHover.svg",
    );
    this.load.image(
      "clickedButton",
      "/assets/common/buttons/squareBlueClicked.svg",
    );
  }

  private loadSpecialImages() {
    this.load.image("star", "/assets/common/star.svg");
  }

  setupLevel() {
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
