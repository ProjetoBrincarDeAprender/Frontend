import Phaser from "phaser";

export default class Credits extends Phaser.Scene {
  constructor() {
    super("vowelsCredits");
  }

  create() {
    this.add.text(230, 400, "Jogo Concluído!", {
      color: "#000",
      fontSize: 40,
    });
  }
}
