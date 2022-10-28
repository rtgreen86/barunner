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
    this.savePlayerPosition(time, gameScene.player);
    this.cleanupOldPositions(time);
    this.updateDebugInfo(time);
  }

  updateDebugInfo(time) {
    const gameScene = this.scene.get('GameScene');
    this.text.setText([
      `Ticks: ${Math.round(time)}`,
      `Player: (${gameScene.player.x}, ${gameScene.player.y}), room ${gameScene.playerChunk}`,
      `Speed (h,v): ${this.getSpeed().join()} pps`,
      'Layers:',
      ...gameScene.map.layers.map(layerData => `${layerData.name} ${layerData.tilemapLayer.x} ${gameScene.getLayerPosition(layerData.name)}`)
    ].join('\n'));
  }

  savePlayerPosition(time, player) {
    this.positions.push({time, x: player.x, y: player.y});
  }

  cleanupOldPositions(time, delta = 1000) {
    this.positions = this.positions.filter(record => record.time + delta >= time);
  }

  getSpeed() {
    const [minTime, maxTime] = this.positions
      .map(({ time }) => time)
      .reduce(minMaxReducer, [Infinity, 0]);
    const [minX, maxX] = this.positions
      .map(rec => rec.x)
      .reduce(minMaxReducer, [Infinity, 0]);
    const [minY, maxY] = this.positions
      .map(rec => rec.y)
      .reduce(minMaxReducer, [Infinity, 0]);
    const time = (maxTime - minTime) / 1000;
    const horizontalDistance = maxX - minX;
    const verticalDistance = maxY - minY;
    return [
      Math.round(horizontalDistance / time),
      Math.round(verticalDistance / time)
    ];
  }
}

const minMaxReducer = ([min, max], value) => [
  Math.min(min, value),
  Math.max(max, value)
];
