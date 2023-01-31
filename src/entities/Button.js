import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture, frame, caption = '') {
    super(scene, x, y, [
      scene.add.image(0, 0, texture, frame).setName('background'),
      scene.add.text(0, 0, caption, Styles.buttonText).setOrigin(0.5, 0.5),
      scene.add.image(-125 - 50, 0, 'one-switch').setName('marker').setVisible(false)
    ]);

    const background = this.getByName('background');

    this.isDown = false;
    this.style = {};

    this.setSize(background.width, background.height);
    this.setScrollFactor(0, 0);
    this.setInteractive();
    this.updateStatus();

    this.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
    this.on(Phaser.Input.Events.POINTER_OUT, this.handlePointerOut);
    this.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp);
    this.on('keepAlive', this.handleKeepAlive);

    this.debug = scene.scene.get('DebugScene');
  }

  get isFocus() {
    return this.getByName('marker').visible;
  }

  set isFocus(value) {
    this.getByName('marker').setVisible(value);
  }

  setDefault() {
    this.getByName('background').setTint(this.style.default);
    return this;
  }

  setPressed() {
    this.getByName('background').setTint(this.style.pressed);
    return this;
  }

  setFocus(value) {
    this.isFocus = value;
    return this;
  }

  setStyle(styleName) {
    this.style = Styles[styleName] || {};
    this.setDefault();
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

  shutdown() {
    super.shutdown();
    this.debug.log('button shutdown');
  }

  handleKeepAlive() {
    this.debug.log('button keep a live');
    setTimeout(() => {
      this.debug.log('send');
      this.emit('keepAlive')
    }, 500);
  }

}
