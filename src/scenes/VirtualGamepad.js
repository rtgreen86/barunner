import Phaser from 'phaser';

export default class VirtualGamepad extends Phaser.Scene {
  constructor() {
    super('VirtualGamepad');
    this.isPointerDown = false;
  }

  create() {
    this.createXButton();

    this.input.on('gameobjectover', () => {
      console.log('gameobjectover');
    });
  }

  createXButton() {
    const texture = this.textures.get('button-x').get();
    const scale = 0.5;
    const x = 1280 - texture.width * scale / 2;
    const y = texture.height * scale / 2;
    this.add.baButton(x, y, 'button-x', 0).setScale(scale).on('click', () => {
      this.scene.stop();
      setTimeout(() => this.scene.start('VirtualGamepad'), 1000);
    });
  }

  update() {
    const gameScene = this.scene.get('GameScene');
    const player = gameScene.children.getByName('The Player');

    if (this.input.activePointer.isDown) {
      player.touch();
    }

    this.isPointerDown = this.input.activePointer.isDown;
  }
}
