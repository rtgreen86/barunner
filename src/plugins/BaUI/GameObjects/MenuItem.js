import * as Phaser from 'phaser';
import Clickable from '../Behavior/Clickable';
import Activable from '../Behavior/Activable';

export default class MenuItem extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);

    this.setOrigin(0.5);
    this.setInteractive({cursor: 'pointer'});

    new Clickable(this);
    new Activable(this);
  }
}
