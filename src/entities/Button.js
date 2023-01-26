import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class Button extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.isDown = false;
    this.style = Styles.greenButton;

    this.setScrollFactor(0, 0);
    this.setInteractive();
    this.setTint(this.style.default);

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
  }

  setStyle(style) {
    this.style = style;
    this.setTint(this.style.default);
  }

  handlePointerDown() {
    this.setTint(this.style.pressed);
    this.isDown = true;
  }

  handlePointerOut() {
    this.setTint(this.style.default);
    this.isDown = false;
  }

  handlePointerUp() {
    if (this.isDown) {
      this.emit('click');
    }
    this.setTint(this.style.default);
    this.isDown = false;
  }
}
