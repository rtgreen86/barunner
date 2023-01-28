import Phaser from 'Phaser';

import Button from '../entities/Button';
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

    this.button = this.add.existing(new Button(this, 640, 200, 'button-gray'));

    this.button.on('click', () => {
      this.scene.stop('MenuScene');
      this.scene.resume('GameScene');
      this.scene.wake('ScoreboardScene');
    });

    this.add.text(640, 200, 'Continue', Styles.buttonText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.button1 = this.add.existing(new Button(this, 640, 300, 'button-gray'));
    this.button1.setStyle(Styles.redButton);

    this.add.text(640, 300, 'Reset', Styles.buttonText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.add.existing(new Button2(this, 640, 400, 'button-gray', 0, 'Hello World!').setStyle('greenButton'));
  }
}
