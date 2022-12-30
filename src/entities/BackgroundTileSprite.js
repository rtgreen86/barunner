import Phaser from 'Phaser';

export default class BackgroundTileSprite extends Phaser.GameObjects.TileSprite {
  constructor(scene, image, width, height) {
    super(scene, image.x, image.y, width, height, image.name);
    this.textureScrollFactorX = 1;
    this.textureScrollFactorY = 1;
    this.setOrigin(0, 0)
    this.setScrollFactor(0, 1)

    for (const prop of image.properties) {
      this[prop.name] = prop.value;
    }
  }

  update() {
    this.tilePositionX = this.scene.cameras.main.scrollX * this.textureScrollFactorX;
  }
}