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
  }

  update() {
    const width = this.layer.layer.widthInPixels;
    const cameraX = this.scene.cameras.main.scrollX * this.scrollFactorX;
    this.x = Math.floor(cameraX / width) * width;
  }
}