import Phaser from 'Phaser';

import Button from '../entities/Button';

import * as Styles from '../Styles';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(640, 100, 'Пауза', Styles.uiText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.buttons = [
      this.add.existing(new Button(this, 640, 200, 'button-gray', 0, 'Продовжити'))
        .setStyle('greenButton')
        .setFocus(true)
        .on('click', this.gotoGame, this),

      this.add.existing(new Button(this, 640, 300, 'button-gray', 0, 'Спочатку'))
        .setStyle('redButton')
        .on('click', this.resetGame, this)
    ];

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false, false).on('down', this.gotoGame, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleEnterKeyPressed, this);
  }

  gotoGame() {
    this.scene.stop('MenuScene');
    this.scene.resume('GameScene');
    this.scene.wake('ScoreboardScene');
  }

  resetGame() {
    const gameScene = this.scene.get('GameScene');
    gameScene.scene.restart();
    const ScoreboardScene = this.scene.get('ScoreboardScene');
    ScoreboardScene.scene.restart();
    this.scene.stop('MenuScene');
  }

  handleArrowKeyPressed(event) {
    let index = this.buttons.findIndex(item => item.isFocus);
    if (index > -1) {
      this.buttons[index].isFocus = false
    }
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) {
      index--;
    }
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) {
      index++;
    }
    if (index < 0) {
      index = this.buttons.length - 1;
    }
    if (index === this.buttons.length) {
      index = 0;
    }
    this.buttons[index].isFocus = true
  }

  handleEnterKeyPressed() {
    const activeIndex = this.buttons.findIndex(item => item.isFocus);
    if (activeIndex > -1) {
      this.buttons[activeIndex].emit('click');
    }
  }
}
