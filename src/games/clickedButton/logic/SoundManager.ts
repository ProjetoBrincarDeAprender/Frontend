import Phaser from "phaser";
/**
 * Classe SoundManager
 *
 * Gerencia a reprodução de sons na cena do jogo.
 * Centraliza o uso do sistema de áudio do Phaser para facilitar o controle de efeitos sonoros.
 *
 * Principais responsabilidades:
 * - Reproduzir sons por chave
 * - Integrar com a cena Phaser
 */

export default class SoundManager {
  /** Cena principal do Phaser onde os sons serão reproduzidos */
  private scene: Phaser.Scene;

  /**
   * Inicializa o gerenciador de sons com a cena alvo.
   * @param scene Cena Phaser
   */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Reproduz um som na cena, usando a chave informada.
   * @param key Chave do som carregado
   */
  play(key: string) {
    this.scene.sound.play(key);
  }
}
