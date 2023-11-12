import * as Phaser from 'phaser';
import Clickable from '../Behavior/Clickable';

export default class MenuItem extends Phaser.GameObjects.Text {
  #clickable = new Clickable(this);

  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);
    this.setOrigin(0.5);
    this.setInteractive({cursor: 'pointer'});
  }

  destroy(fromScene) {
    super.destroy(fromScene);
    this.#clickable.destroy();
  }
}
