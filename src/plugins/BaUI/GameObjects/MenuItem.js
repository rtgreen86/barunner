import * as Phaser from 'phaser';
import Clickable from '../Behavior/Clickable';
import Activable from '../Behavior/Activable';

export default class MenuItem extends Phaser.GameObjects.Text {
  #clickable = new Clickable(this);

  #activable = new Activable(this);

  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);

    this.setOrigin(0.5);
    this.setInteractive({cursor: 'pointer'});
  }

  destroy(fromScene) {
    super.destroy(fromScene);

    this.#clickable.destroy();
    this.#activable.destroy();
  }
}
