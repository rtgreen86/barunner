import { Scene, GameObjects } from 'phaser';

export default class DialogScene extends Scene {
  shade: GameObjects.Graphics;

  greenButton: GameObjects.Button;

  yellowButton: GameObjects.Button;

  redButton: GameObjects.Button;

  xButton: GameObjects.Button;

  constructor() {
    super('DialogScene');
  }

  create() {
    this.shade = this.add.graphics().fillStyle(0xFFFFFF, 0.5).fillRect(0, 0, 1280, 720);

    this.greenButton = this.add.button(175, 75, 'button-green', 0).setScale(0.5);
    this.yellowButton = this.add.button(175, 75 * 3, 'button-yellow', 0).setScale(0.5);
    this.redButton = this.add.button(175, 75 * 5, 'button-red', 0).setScale(0.5);

    const buttonTextStyle = {font: '32px Arial', color: '#ffffff'};

    this.add.text(175, 65, 'Hello World', buttonTextStyle).setOrigin(0.5, 0.5);
    this.add.text(175, 70 * 3, 'Hello World', buttonTextStyle).setOrigin(0.5, 0.5);
    this.add.text(175, 72 * 5, 'Hello World', buttonTextStyle).setOrigin(0.5, 0.5);

    this.xButton = this.add.button(175, 75 * 7, 'button-x', 0).setScale(0.5, 0.5);

    this.add.image(640, 360, 'dialog_bg').setScale(0.3);
    this.add.image(640, 360, 'dialog_frame').setScale(0.3);

  }
}
