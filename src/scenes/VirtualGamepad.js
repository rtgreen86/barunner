import Phaser from 'phaser';

export default class VirtualGamepad extends Phaser.Scene {
  constructor() {
    super('VirtualGamepad');
  }

  create() {
    this.createXButton();
  }

  createXButton() {
    const texture = this.textures.get('button-x').get();
    const scale = 0.5;
    const x = 1280 - texture.width * scale / 2;
    const y = texture.height * scale / 2;
    this.add.baButton(x, y, 'button-x', 0).setScale(scale);
  }

  update() {
    if (this.input.activePointer.isDown) {
      console.log('pointer down');
    }
  }




}
