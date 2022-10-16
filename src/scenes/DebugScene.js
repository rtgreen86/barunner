import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
  }

  create() {
    this.text = this.add.text(0, 0, 'Hello World');
    this.text.setFontSize('24px');
    this.text.setColor('black');
  }
}