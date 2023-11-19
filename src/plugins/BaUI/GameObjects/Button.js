import * as Phaser from 'phaser';
import Clickable from '../Behavior/Clickable';

export default class Button extends Phaser.GameObjects.Image {
  #clickable = new Clickable(this);

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.setInteractive({
      cursor: 'pointer',
      pixelPerfect: true
    });
  }

  press() {
    this.emit('click');
  }
}
