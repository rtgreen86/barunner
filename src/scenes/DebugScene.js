import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this.positions = [];
  }

  create() {
    this.text = this.add.text(0, 0, 'Debug Information');
    this.text.setFontSize('24px');
    this.text.setColor('black');
  }

  update(time) {
    const gameScene = this.scene.get('GameScene');
    this.savePlayerPosition(time, gameScene.player.x);
    this.cleanupOldPositions(time);
    this.updateDebugInfo(time);
  }

  updateDebugInfo(time) {
    const gameScene = this.scene.get('GameScene');
    this.text.setText([
      `Ticks: ${Math.round(time)}`,
      `Player: (${gameScene.player.x}, ${gameScene.player.y}), room ${gameScene.playerChunk}`,
      `Speed: ${this.getSpeed()} pps`,
      `Meters count: ${this.positions.length}`,
      'Layers:',
      ...gameScene.map.layers.map(layerData => `${layerData.name} ${layerData.tilemapLayer.x} ${gameScene.getLayerPosition(layerData.name)}`)
    ].join('\n'));
  }

  savePlayerPosition(time, position) {
    this.positions.push({time, position});
  }

  cleanupOldPositions(time, delta = 1000) {
    this.positions = this.positions.filter(record => record.time + delta >= time);
  }

  getSpeed() {
    const [minTime, maxTime] = this.positions.reduce(([min, max], record) => [
      Math.min(min, record.time),
      Math.max(max, record.time)
    ], [Infinity, 0]);
    const [minPosition, maxPosition] = this.positions.reduce(([min, max], record) => [
      Math.min(min, record.position),
      Math.max(max, record.position)
    ], [Infinity, 0]);
    const time = (maxTime - minTime) / 1000;
    const distance = maxPosition - minPosition;
    return Math.round(distance / time);
  }

}