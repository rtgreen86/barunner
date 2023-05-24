import Phaser from 'phaser';

import Button from '../entities/Button';

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

    this.buttons = [
      this.add.existing(new Button(this, 640, 200, 'buttons', 0, 'Продовжити'))
        .setFocus(true)
        .on('focus', this.handleButtonFocus, this)
        .on('pointerOverButton', this.handleButtonOvered, this)
        .on('click', this.gotoGame, this),

      this.add.existing(new Button(this, 640, 300, 'buttons', 2, 'Спочатку'))
        .setName('restart')
        .on('pointerover', this.handleMouseOver, this)
        .on('pointerout', this.handleMouseOut, this)
        .on('focus', this.handleButtonFocus, this)
        .on('pointerOverButton', this.handleButtonOvered, this)
        .on('click', this.gotoConfirm, this),
    ];

    const command = {
      scene: this,
      execute() {
        this.scene.gotoGame()
      }
    }

    this.uiButton = this.add.UITextButton(640, 500, 'My Button', 'button-green')
      .setDownTint(0x888888)
      .setFocusTint(0xff0000)
      .setFocus(true)
      .setDisabledTint(0x333333)
      .setDisabled(true)
      .setClickCommand(command)
      .setDisabled(false)
      .setFocus(false);

    this.arrow = this.add.sprite(
      this.uiButton.x - this.uiButton.width / 2,
      this.uiButton.y,
      'pointer'
    ).setOrigin(1, 0.5)
    .play('Bidirectional Pointer');

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false, false).on('down', this.gotoGame, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleArrowKeyPressed, this);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false).on(Phaser.Input.Keyboard.Events.DOWN, this.handleEnterKeyPressed, this);
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
    this.buttons[index].isFocus = true
  }

  handleEnterKeyPressed() {
    const activeIndex = this.buttons.findIndex(item => item.isFocus);
    if (activeIndex > -1) {
      this.buttons[activeIndex].emit('click');
    }
  }

  handleMouseOver(event) {
    // let index = this.buttons.findIndex(item => item.isFocus);
    // if (index > -1) {
    //   this.buttons[index].isFocus = false
    // }
    // this.buttons[0].isFocus = true;
    // console.log('pointer over')
  }

  handleMouseOut(event) {
    // this.clearTint();
  }

  handleButtonFocus(button) {

    for (let i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].isFocus && this.buttons[i] !== button) {
        this.buttons[i].isFocus = false;
      }
    }


  }

  handleButtonOvered(button) {
    button.isFocus = true;
  }


}
