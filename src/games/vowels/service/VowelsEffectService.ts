import EffectManager from "@/games/common/managers/EffectManager";
import Button from "@/games/common/models/Button";

export default class VowelsEffectService {
  private effectManager: EffectManager;

  constructor(effectManager: EffectManager) {
    this.effectManager = effectManager;
  }

  buttonSuccessEffect(
    button: Button,
    particleTexture?: string,
    successColor: number = 0x00ff00,
  ) {
    this.effectManager.growup(button);
    this.effectManager.changeColor(button.getButtonText(), successColor);
    if (particleTexture) this.effectManager.particles(particleTexture);
  }

  buttonFailEffect(button: Button, failColor: number = 0xff0000) {
    this.effectManager.growup(button, "Bounce", 1.2, 200);
    this.effectManager.changeColor(button.getButtonText(), failColor);
  }
}
