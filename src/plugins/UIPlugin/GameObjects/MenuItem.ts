import * as Phaser from 'phaser';
import { Clickable } from '../Behavior';

export default class MenuItem extends Phaser.GameObjects.Text implements Phaser.GameObjects.BaMenuItem {
  private clickable: Clickable;

  constructor(
    scene: Phaser.Scene,
    x: number, y: number,
    text: string | string[],
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, style);

    this.setOrigin(0.5);

    this.setInteractive({cursor: 'pointer'});

    this.clickable = new Clickable(this);
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    this.clickable.destroy();
  }
}
