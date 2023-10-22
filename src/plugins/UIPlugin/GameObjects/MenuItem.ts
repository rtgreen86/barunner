import * as Phaser from 'phaser';

export default class MenuItem extends Phaser.GameObjects.Text implements Phaser.GameObjects.BaMenuItem {
  constructor(
    scene: Phaser.Scene,
    x: number, y: number,
    text: string | string[],
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, style);
    this.setOrigin(0.5);
  }

  click() {
    return this;
  }

  onClick(fn: Function, context: any) {
    return this;
  }
}
