import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class Button extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.isDown = false;

    this.setScrollFactor(0, 0);
    this.setInteractive();

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
  }

  handlePointerDown() {
    this.setTint(Styles.buttonTintColor);
    this.isDown = true;
  }

  handlePointerOut() {
    this.clearTint();
    this.isDown = false;
  }

  handlePointerUp() {
    if (this.isDown) {
      this.emit('click');
    }
    this.clearTint();
    this.isDown = false;
  }
}
