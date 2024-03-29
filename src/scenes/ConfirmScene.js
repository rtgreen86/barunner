import Phaser from 'phaser';

import Button2 from '../entities/Button2';

import * as Styles from '../Styles';

export default class ConfirmScene extends Phaser.Scene {
  constructor() {
    super('ConfirmScene');
  }

  create() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFFFFFF, 0.5);
    graphics.fillRect(0, 0, 1280, 720);

    const i = this.add.image(640, 360, 'modal-dialog');
    i.angle = 90;

    this.add.text(640, 200, 'Весь прогрес буде скинуто!\nВи впевнені?', Styles.confirmText).setScrollFactor(0, 0).setOrigin(0.5, 0,5);

    const buttonYes = this.add.existing(new Button2(this, 480, 500, 'buttons', 3, 'Так'))
      .setTextStyle('dangerlink')
      .on('click', this.resetGame, this);

    const buttonNo = this.add.existing(new Button2(this, 800, 500, 'buttons', 3, 'Ні'))
      .setFocus(true)
      .setTextStyle('link')
      .on('click', this.gotoMenu, this);

    this.buttons = [buttonYes, buttonNo];

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleEnterKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleEscKeyPressed, this);
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

  handleArrowKeyPressed(event) {
    let index = this.buttons.findIndex(item => item.isFocus);
    if (index > -1) {
      this.buttons[index].isFocus = false
    }
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) {
      index--;
    }
    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
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

  handleEscKeyPressed() {
    this.buttons[1].emit('click');
  }
}