import Phaser from 'phaser';

export default class DebugScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugScene', active: false });

    this.properties = {
      'scene': 'DebugScene',
      'test': ''
    };

    this.messages = ['debug scene'];
  }

  create() {
    this.text = this.add.text(0, 40).setFontSize('24px').setColor('black');
  }

  update() {
    const vg = this.scene.get('virtual-gamepad-scene');

    this.properties.mousedown = vg.input.activePointer.isDown;

    this.messages = this.messages.slice(-10);

    this.text.setText([
      ...Object.keys(this.properties).map((key) => `${key}: ${this.properties[key]}`),
      ...this.messages
    ].join('\n'));
  }

  log() { }
}
