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
  private question?: Phaser.GameObjects.Text;
  private entity?: Phaser.GameObjects.Image;
  private options: Button[] = [];
  private content: Button[] = [];

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
    this.question = this.scene.add
      .text(400, 80, text, {
        font: "bold 40px Arial",
        color: "#250e00ff",
      })
      .setOrigin(0.5, 0.5);
  }

  public showEntity(): void {
    const entityKey = this.levelManager.getActualLevel().getEntityKey();
    if (!entityKey) return;
    this.entity = this.scene.add
      .image(400, 240, entityKey)
      .setOrigin(0.5, 0.5)
      .setScale(0.4);
  }

  public showContent(): void {
    const content = this.levelManager.getActualLevel().getContent();
    if (!content) return;

    const imageKey = this.levelManager.getActualLevel().getEntityKey();
    let newPositionY, scale;
    if (imageKey) {
      newPositionY = 380;
      scale = 0.8;
    } else {
      newPositionY = 300;
      scale = 1.2;
    }

    const newContent: Button[] = [];
    const spaceBetweenContent = 60;
    let buttonWidth = 20 * scale;
    const totalWidthOccupied =
      (content.length - 1) * spaceBetweenContent + buttonWidth * content.length;
    const startX = (this.scene.cameras.main.width - totalWidthOccupied) / 2;

    for (let i = 0; i < content.length; i++) {
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = this.buttonManager.createButton({
        positions: { x: newPositionX, y: newPositionY },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: content[i],
        fontSize: 40,
        scale: scale,
      });
      newContent.push(contentItem);
    }
    this.content = newContent;
  }

  public showOptions(): void {
    const options = this.levelManager.getActualLevel().getOptions();
    const newOptions: Button[] = [];
    const spaceBetweenOptions =
      this.scene.cameras.main.width / (options.length + 1);

    for (let i = 0; i < options.length; i++) {
      const newPositionX = spaceBetweenOptions * (i + 1);
      const option = this.buttonManager.createButton({
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
      newOptions.push(option);

      option.off("released");
      option.on("released", () => {
        this.handleOptionClick(option);
      });
    }
    this.options = newOptions;
  }

  private handleOptionClick(selectedOption: Button): void {
    const answer = this.levelManager.getActualLevel().getAnswer();
    if (selectedOption.getButtonStringText() === answer) {
      this.setOptionsEnabled(false);

      this.effectManager.growup(selectedOption, "expo.out", 1.6, 400);
      this.effectManager.changeColor({
        gameObject: selectedOption,
        color: 0x00ff00,
        duration: 800,
      });
      this.effectManager.starEffect(selectedOption.x, selectedOption.y);
      this.soundManager.play("correct");
      this.updateContentToComplete();
      this.scene.time.delayedCall(3000, () => {
        this.nextLevel();
      });
    } else {
      selectedOption.disableInteractive();

      this.effectManager.growup(selectedOption, "bounce.out", 1.2, 200);
      this.effectManager.changeColor({
        gameObject: selectedOption,
        color: 0xff0000,
        duration: 400,
      });
      this.soundManager.play("incorrect");

      this.scene.time.delayedCall(400, () => {
        selectedOption.setInteractive();
      });
    }
  }

  private updateContentToComplete(): void {
    if (!this.content) return;
    this.content.forEach((text) => text.destroy());
    this.content = [];

    const completeContent = this.levelManager
      .getActualLevel()
      .getCompleteContent();
    if (!completeContent) return;

    const imageKey = this.levelManager.getActualLevel().getEntityKey();
    let newPositionY, scale;
    if (imageKey) {
      newPositionY = 380;
      scale = 0.8;
    } else {
      newPositionY = 300;
      scale = 1.2;
    }

    const newContent: Button[] = [];
    const spaceBetweenContent = 60;
    let buttonWidth = 20 * scale;
    const totalWidthOccupied =
      (completeContent.length - 1) * spaceBetweenContent +
      buttonWidth * completeContent.length;
    const startX = (this.scene.cameras.main.width - totalWidthOccupied) / 2;

    for (let i = 0; i < completeContent.length; i++) {
      const newPositionX = startX + i * (buttonWidth + spaceBetweenContent);
      const contentItem = this.buttonManager.createButton({
        positions: { x: newPositionX, y: newPositionY },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: completeContent[i],
        fontSize: 40,
        scale: scale,
      });
      newContent.push(contentItem);
    }
    this.content = newContent;
  }

  private clearLevelElements(): void {
    this.question?.destroy();
    this.entity?.destroy();
    this.content.forEach((text) => text.destroy());
    this.content = [];
    this.options.forEach((option) => option.destroy());
    this.options = [];
  }

  private nextLevel(): void {
    this.clearLevelElements();
    if (!this.levelManager.nextLevel()) {
      this.scene.scene.start("clickedButtonStartScene");
    } else {
      this.showQuestion();
      this.showEntity();
      this.showContent();
      this.showOptions();
    }
  }

  private setOptionsEnabled(enabled: boolean): void {
    this.options.forEach((option) => option.disableInteractive());
    if (enabled) {
      this.options.forEach((option) => option.setInteractive());
    }
  }
}
