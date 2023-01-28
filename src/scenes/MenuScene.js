import Phaser from 'Phaser';

import Button2 from '../entities/Button2';

import * as Styles from '../Styles';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.text = this.add.text(640, 100, 'Pause', Styles.uiText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false).on('down', () => {
      this.scene.stop('MenuScene');
      this.scene.resume('GameScene');
      this.scene.wake('ScoreboardScene');
    });

    this.add.existing(new Button2(this, 640, 200, 'button-gray', 0, 'Continue'))
      .setStyle('greenButton')
      .on('click', () => {
        this.scene.stop('MenuScene');
        this.scene.resume('GameScene');
        this.scene.wake('ScoreboardScene');
      });

    this.add.existing(new Button2(this, 640, 300, 'button-gray', 0, 'Reset'))
      .setStyle('redButton');
  }
}
