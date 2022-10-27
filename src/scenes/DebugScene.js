import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
  }

  create() {
    this.text = this.add.text(0, 0, 'Debug Information');
    this.text.setFontSize('24px');
    this.text.setColor('black');
  }

  update(time) {
    this.updateDebugInfo(time);
  }

  updateDebugInfo(time) {
    const gameScene = this.scene.get('GameScene');
    this.text.setText([
      `Ticks: ${Math.round(time)}`,
      `Player: (${gameScene.player.x}, ${gameScene.player.y}), room ${gameScene.playerChunk}`,
      'Layers:',
      ...gameScene.map.layers.map(layerData => `${layerData.name} ${layerData.tilemapLayer.x} ${gameScene.getLayerPosition(layerData.name)}`)
    ].join('\n'));
  }
}