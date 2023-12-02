import Phaser from 'phaser';

export default class DebugScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugScene', active: true });
    this.messages = ['debug scene'];
  }

  create() {
    this.text = this.add.text(0, 40).setFontSize('24px').setColor('black');
  }

  update() {
    this.text.setText(this.messages.join('\n'));
  }

  log() { }
}
