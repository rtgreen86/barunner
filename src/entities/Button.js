import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, frame, text = '') {
    super(scene, x, y, [
      new Phaser.GameObjects.Image(scene, 0, 0, texture, frame).setName('background'),
      new Phaser.GameObjects.Text(scene, 0, 0, text, Styles.buttonText).setOrigin(0.5, 0.5).setName('text')
    ]);

    this.isDown = false;
    this.style = {};

    this.setScrollFactor(0, 0);
    const background = this.getByName('background');
    const width = background.width;
    const height = background.height;
    this.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
  }

  setDefault() {
    this.getByName('background').setTint(this.style.default);
    return this;
  }

  setPressed() {
    this.getByName('background').setTint(this.style.pressed);
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
