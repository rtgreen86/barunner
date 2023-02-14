import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, frame, caption = '') {
    super(scene, x, y, [
      scene.add.image(0, 0, texture, frame).setName('background'),
      scene.add.text(0, 0, caption, Styles.buttonText).setOrigin(0.5, 0.65),
      scene.add.image(-125 - 50, 0, 'one-switch').setName('marker').setVisible(false)
    ]);

    const background = this.getByName('background');

    this.isDown = false;

    this.setSize(background.width, background.height);
    this.setScrollFactor(0, 0);
    this.setInteractive();
    this.updateStatus();

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
  }

  get isFocus() {
    return this.getByName('marker').visible;
  }

  set isFocus(value) {
    this.getByName('marker').setVisible(value);
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

  updateStatus() {
    const marker = this.getByName('marker');
    marker.setVisible(this.isFocus);
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
