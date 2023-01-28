import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, frame, caption = '') {
    super(scene, x, y);

    const background = scene.add.image(0, 0, texture, frame);
    const text = scene.add.text(0, 0, caption, Styles.buttonText).setOrigin(0.5, 0.5);

    this.isDown = false;
    this.style = {};
    this.background = background;

    this.add([background, text]);
    this.setSize(background.width, background.height);
    this.setScrollFactor(0, 0);
    this.setInteractive();

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
  }

  setDefault() {
    this.background.setTint(this.style.default);
    return this;
  }

  setPressed() {
    this.background.setTint(this.style.pressed);
    return this;
  }

  setStyle(styleName) {
    this.style = Styles[styleName] || {};
    this.setDefault();
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
