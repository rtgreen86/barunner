import Phaser from 'Phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.text = this.add.text(500, 500, 'Pause').setScrollFactor(0, 0);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false).on('down', () => {
      this.scene.stop('MenuScene');
      this.scene.resume('GameScene');
      this.scene.wake('ScoreboardScene');
    });
  }
}
