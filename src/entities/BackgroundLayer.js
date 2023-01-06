import Phaser from "Phaser";

export default class BackgroundLayer extends Phaser.GameObjects.RenderTexture {
  constructor(scene, tilemapLayer, x, y) {
    super(scene, x, y, tilemapLayer.width, tilemapLayer.height);

    this.scrollFactorX = 0;
    this.autoScrollX = 0;

    for (const prop of tilemapLayer.layer.properties) {
      this[prop.name] = prop.value;
    }

    this.tilemapLayer = tilemapLayer;
    this.width = this.tilemapLayer.layer.widthInPixels - scene.game.config.width

    this.draw(tilemapLayer);
  }

  static create(scene, map, layerName, x, y) {
    return new BackgroundLayer(
      scene,
      map.createLayer(layerName, map.tilesets, x, y).setVisible(false),
      x, y
    );
  }

  update(time) {
    const cameraX = this.scene.cameras.main.scrollX * this.scrollFactorX;
    this.x = Math.floor(cameraX / this.width) * this.width;

    if (this.autoScrollX) {
      this.x = (this.autoScrollX / 1000) * time;
      if (this.x < this.width) {
        this.x = this.x % this.width;
      }
      if (this.x > 0) {
        this.x = (this.x - this.width) % this.width;
      }
    }
  }
}