import Phaser from 'phaser';

import * as Styles from '../Styles';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFFFFFF, 0.5);
    graphics.fillRect(0, 0, 1280, 720);

    this.add.text(640, 100, 'Пауза', Styles.uiText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.activeButton = 0;

    const gotoGameCmd = {
      scene: this,
      execute() {
        this.scene.gotoGame()
      }
    }

    const gotoConfirmCmd = {
      scene: this,
      execute() {
        this.scene.gotoConfirm()
      }
    }

    this.uiButton = this.add.UITextButton(640, 200, 'Продовжити', 'button-green')
      .setDownTint(0x888888)
      .setFocus(true)
      .setClickCommand(gotoGameCmd);


    this.uiButton2 = this.add.UITextButton(640, 300, 'Спочатку', 'button-red')
      .setDownTint(0x888888)
      .setClickCommand(gotoConfirmCmd);

    this.input.on('pointerover', this.handleMouseOver, this);

    this.buttons = [
      this.uiButton, this.uiButton2
    ];

    this.arrow = this.add.sprite(
      this.uiButton.x - this.uiButton.width / 2,
      this.uiButton.y,
      'pointer'
    ).setOrigin(1, 0.5)
      .play('Bidirectional Pointer');

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false, false).on('down', this.gotoGame, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
  }

  gotoGame() {
    let index = this.buttons.findIndex(item => item.isFocus);
    if (index > -1) {
      this.buttons[index].isFocus = false
    }
    this.buttons[0].isFocus = true;
    this.scene.stop('MenuScene');
    this.scene.resume('GameScene');
    this.scene.wake('ScoreboardScene');
  }

  gotoConfirm() {
    let index = this.buttons.findIndex(item => item.isFocus);
    if (index > -1) {
      this.buttons[index].isFocus = false
    }
    this.buttons[1].isFocus = true;
    this.scene.stop('MenuScene');
    this.scene.run('ConfirmScene');
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
    this.buttons[index].isFocus = true;
    this.arrow.setPosition(
      this.buttons[index].x - this.buttons[index].width / 2,
      this.buttons[index].y,
    );
  }

  handleMouseOver(event, gameObjects) {
    this.buttons.forEach((btn) => btn.setFocus(false));
    gameObjects.forEach((btn) => {
      if (btn.setFocus) btn.setFocus(true);
    });
    let index = this.buttons.findIndex(item => item.isFocus);
    if (index > -1) {
      this.arrow.setPosition(
        this.buttons[index].x - this.buttons[index].width / 2,
        this.buttons[index].y,
      );
    }
  }
}
