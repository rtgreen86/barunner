import Phaser from 'Phaser';

import Button from '../entities/Button';

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

    this.add.existing(new Button(this, 640, 200, 'button-gray', 0, 'Continue'))
      .setStyle('greenButton')
      .on('click', () => {
        this.scene.stop('MenuScene');
        this.scene.resume('GameScene');
        this.scene.wake('ScoreboardScene');
      });

    this.add.existing(new Button(this, 640, 300, 'button-gray', 0, 'Reset'))
      .setStyle('redButton')
      .on('click', () => {
        const gameScene = this.scene.get('GameScene');
        gameScene.scene.restart();
        const ScoreboardScene = this.scene.get('ScoreboardScene');
        ScoreboardScene.scene.restart();
        this.scene.stop('MenuScene');
      });

    this.events.once('shutdown', this.handleShutdown);
  }


  handleShutdown(sys) {
    const dbg = sys.scene.scene.get('DebugScene');
    dbg.log('shutdown');
  }
}
