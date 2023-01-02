import Phaser from "Phaser";

export default class BackgroundLayer extends Phaser.GameObjects.RenderTexture {
  constructor(scene, tilemapLayer, x, y) {
    super(scene, x, y, tilemapLayer.width * 2, tilemapLayer.height);

    this.tilemapLayer = tilemapLayer;
    for (const prop of this.tilemapLayer.layer.properties) {
      this[prop.name] = prop.value;
    }

    this.draw(tilemapLayer);
    this.draw(tilemapLayer, tilemapLayer.width, 0);

    // this.scene.events.on('update', this.handleUpdate, this);
  }

  static create(scene, map, layerName, x, y) {
    return new BackgroundLayer(
      scene,
      map.createLayer(layerName, map.tilesets, x, y).setVisible(false),
      x, y
    );
  }

  update() {
    const width = this.tilemapLayer.layer.widthInPixels;
    const cameraX = this.scene.cameras.main.scrollX * this.scrollFactorX;
    this.x = Math.floor(cameraX / width) * width;
  }
}