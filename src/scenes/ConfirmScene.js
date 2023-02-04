import Phaser from 'Phaser';

import Button from '../entities/Button';

import * as Styles from '../Styles';

export default class ConfirmScene extends Phaser.Scene {
  constructor() {
    super('ConfirmScene');
  }

  create() {
    this.add.text(640, 100, 'Confirm Reset?', Styles.uiText).setScrollFactor(0, 0).setOrigin(0.5, 0,5);

    this.buttons = [
      this.add.existing(new Button(this, 640, 300, 'button-gray', 0, 'Yes'))
        .setStyle('redButton')
        .on('click', this.resetGame, this),

      this.add.existing(new Button(this, 640, 200, 'button-gray', 0, 'No'))
        .setStyle('greenButton')
        .setFocus(true)
        .on('click', this.gotoMenu, this),
    ];

  }


  gotoMenu() {
    this.scene.stop('ConfirmScene');
    this.scene.run('MenuScene', { game: 'GameScene' });
  }

  resetGame() {
    const gameScene = this.scene.get('GameScene');
    gameScene.scene.restart();
    const ScoreboardScene = this.scene.get('ScoreboardScene');
    ScoreboardScene.scene.restart();
    this.scene.stop('ConfirmScene');
  }
}