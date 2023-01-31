import Phaser from 'Phaser';

import Button from '../entities/Button';

import * as Styles from '../Styles';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const debug = this.scene.get('DebugScene');


    this.text = this.add.text(640, 100, 'Pause', Styles.uiText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false).on('down', () => {
      this.scene.stop('MenuScene');
      this.scene.resume('GameScene');
      this.scene.wake('ScoreboardScene');
    });

    this.buttons = [];

    const btn1 = this.add.existing(new Button(this, 640, 200, 'button-gray', 0, 'Continue'))
      .setStyle('greenButton')
      .on('click', () => {

        debug.log('clicked');

        this.scene.stop('MenuScene');
        this.scene.resume('GameScene');
        this.scene.wake('ScoreboardScene');
      });

    const btn2 = this.add.existing(new Button(this, 640, 300, 'button-gray', 0, 'Reset'))
      .setStyle('redButton')
      .on('click', () => {
        const gameScene = this.scene.get('GameScene');
        gameScene.scene.restart();
        const ScoreboardScene = this.scene.get('ScoreboardScene');
        ScoreboardScene.scene.restart();
        this.scene.stop('MenuScene');
      });

    btn1.isFocus = true;
    btn1.updateStatus();

    this.buttons.push(btn1);
    this.buttons.push(btn2);


    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false, false).on(Phaser.Input.Keyboard.Events.DOWN, () => {
      let activeIndex = this.buttons.findIndex(item => item.isFocus);
      if (activeIndex > -1) {
        this.buttons[activeIndex].isFocus = false
        this.buttons[activeIndex].updateStatus();
      }

      activeIndex--;

      if (activeIndex < 0) {
        activeIndex = this.buttons.length - 1;
      }

      this.buttons[activeIndex].isFocus = true
      this.buttons[activeIndex].updateStatus();
    });

    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false, false).on(Phaser.Input.Keyboard.Events.DOWN, () => {
      let activeIndex = this.buttons.findIndex(item => item.isFocus);
      if (activeIndex > -1) {
        this.buttons[activeIndex].isFocus = false
        this.buttons[activeIndex].updateStatus();
      }

      activeIndex++;

      if (activeIndex === this.buttons.length) {
        activeIndex = 0;
      }

      this.buttons[activeIndex].isFocus = true
      this.buttons[activeIndex].updateStatus();
    });

    this.Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false).on(Phaser.Input.Keyboard.Events.DOWN, () => {
      let activeIndex = this.buttons.findIndex(item => item.isFocus);

      if (activeIndex > -1) {
        debug.log('enter' + activeIndex);
        const r = this.buttons[activeIndex].emit('click');
        debug.log(r);
      }


    });
  }
}
