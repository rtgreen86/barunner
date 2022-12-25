import Phaser from "Phaser";

export default class BackgroundLayer extends Phaser.GameObjects.RenderTexture {
  constructor(scene, x, y, layer) {
    super(
      scene, x, y,
      layer.layer.widthInPixels * 2,
      layer.layer.heightInPixels
    );
    this.layer = layer;
    this.layer.setVisible(false);
    this.draw(layer);
    this.draw(layer, layer.layer.widthInPixels, 0);
    for (const prop of layer.layer.properties) {
      this[prop.name] = prop.value;
    }

    this.scene.events.on('update', this.handleUpdate, this);
  }

  update() {
  }

  handleUpdate() {
    const width = this.layer.layer.widthInPixels;
    const cameraX = this.scene.cameras.main.scrollX * this.scrollFactorX;
    this.x = Math.floor(cameraX / width) * width;
  }
}