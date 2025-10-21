import LevelManager from "./LevelManager";
import ButtonManager from "./ButtonManager";
import EffectManager from "./EffectManager";
import SoundManager from "./SoundManager";
import type Button from "./Button";

export default class ClickedButtonLogic {
  private scene: Phaser.Scene;
  private levelManager: LevelManager;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private soundManager: SoundManager;

  constructor(
    scene: Phaser.Scene,
    levelManager: LevelManager,
    buttonManager: ButtonManager,
  ) {
    this.scene = scene;
    this.levelManager = levelManager;
    this.buttonManager = buttonManager;
    this.effectManager = new EffectManager(scene);
    this.soundManager = new SoundManager(scene);
  }

  public showQuestion(): void {
    const text = this.levelManager.getActualLevel().getQuestion();
    this.scene.add
      .text(400, 80, text, {
        font: "bold 40px Arial",
        color: "#250e00ff",
      })
      .setOrigin(0.5, 0.5);
  }

  public showEntity(): void {
    const entityKey = this.levelManager.getActualLevel().getEntityKey();
    this.scene.add.image(400, 240, entityKey).setOrigin(0.5, 0.5).setScale(0.4);
  }

  public showOptions(): void {
    const options = this.levelManager.getActualLevel().getOptions();
    const spaceBetweenButtons =
      this.scene.cameras.main.width / (options.length + 1);

    for (let i = 0; i < options.length; i++) {
      const newPositionX = spaceBetweenButtons * (i + 1);
      const button = this.buttonManager.createButton({
        positions: { x: newPositionX, y: 500 },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: options[i],
        fontSize: 40,
        scale: 1.4,
      });

      button.off("released");
      button.on("released", () => {
        this.handleOptionClick(button);
      });
    }
  }

  private handleOptionClick(selectedOption: Button): void {
    const answer = this.levelManager.getActualLevel().getAnswer();
    if (selectedOption.getButtonStringText() === answer) {
      this.effectManager.growup(selectedOption, "expo.out", 1.6, 400);
      this.effectManager.changeColor({
        gameObject: selectedOption,
        color: 0x00ff00,
        duration: 800,
      });
      this.soundManager.play("correct");
    } else {
      this.effectManager.growup(selectedOption, "bounce.out", 1.2, 200);
      this.effectManager.changeColor({
        gameObject: selectedOption,
        color: 0xff0000,
        duration: 400,
      });
      this.soundManager.play("incorrect");
    }
  }
}
