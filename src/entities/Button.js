import Phaser from 'Phaser';

import * as Styles from '../Styles';

const BUTTON_WIDTH = 250;
const BUTTON_HALF_WIDTH = BUTTON_WIDTH / 2;
const ARROW_WIDTH = 64;
const ARROW_HALF_WIDTH = ARROW_WIDTH / 2;
const ARROW_LEFT_POSITION = -BUTTON_HALF_WIDTH - ARROW_HALF_WIDTH;
const ARROW_RIGHT_POSITION = BUTTON_HALF_WIDTH + ARROW_HALF_WIDTH;

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, frame, caption = '') {
    super(scene, x, y, [
      scene.add.image(0, 0, texture, frame)
        .setName('background'),

      scene.add.text(0, 0, caption, Styles.buttonText)
        .setOrigin(0.5, 0.65),

      scene.add.sprite(ARROW_LEFT_POSITION, 0, 'pointer')
        .setName('marker-left')
        .setVisible(false),

      scene.add.sprite(ARROW_RIGHT_POSITION, 0, 'pointer')
        .setName('marker-right')
        .toggleFlipX()
        .setVisible(false),
    ]);

    const background = this.getByName('background');
    this.setSize(background.width, background.height);
    this.setScrollFactor(0, 0);
    this.setInteractive();

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
  }

  get isFocus() {
    return this.getByName('marker-left').visible;
  }

  set isFocus(value) {
    if (value) {
      this.getByName('marker-left')
        .setVisible(value)
        .play('Bidirectional Pointer');
      this.getByName('marker-right')
        .setVisible(value)
        .play('Bidirectional Pointer');
    } else {
      this.getByName('marker-left')
        .setVisible(value)
        .stop();
      this.getByName('marker-right')
        .setVisible(value)
        .stop();
    }
  }

  setDefault() {
    this.getByName('background').clearTint();
    return this;
  }

  setPressed() {
    this.getByName('background').setTint(Styles.buttonTintColor);
    return this;
  }

  setFocus(value) {
    this.isFocus = value;
    return this;
  }

  handlePointerDown() {
    this.setPressed();
    this.isDown = true;
  }

  handlePointerOut() {
    this.setDefault();
    this.isDown = false;
  }

  handlePointerUp() {
    if (this.isDown) {
      this.isDown = false;
      this.setDefault();
      this.emit('click');
    }
  }
}
