import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this.positions = [];
    this.speedRecords = [];
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
    const speed = this.getSpeed();
    const [speedX, speedY] = speed;
    this.savePlayerSpeed(time, speedX, speedY);
    const delta = this.getDelta();
    this.updateDebugInfo({
      time,
      speed,
      delta
    });
  }

  updateDebugInfo({ time, speed, delta }) {
    const gameScene = this.scene.get('GameScene');
    const ground = gameScene.map.layer.tilemapLayer;
    this.text.setText([
      `Ticks: ${Math.round(time)}`,
      `Player: (${gameScene.player.x}, ${gameScene.player.y}), room ${gameScene.playerChunk}`,
      `On the ground: ${gameScene.player.isOnGround}, jump time: ${gameScene.player.jumpTime}, is jumping: ${gameScene.player.isJumping}`,
      `Speed (h,v): ${speed.join()} pps`,
      `Delta: ${delta.join(', ')}`,
      `Obstacles: ${gameScene.obstacles2.countActive()}, ${gameScene.obstacles2.countActive(false)} ${gameScene.obstacles2.getLength()}`,
      `Camera X: ${gameScene.cameras.main.scrollX}`,
      `Ground X, W: ${ground.x}, ${ground.width}`,
      'Layers:',
      // ...gameScene.level.layers.map(layerData => `${layerData.name} ${layerData.tilemapLayer.x} ${gameScene.getLayerPosition(layerData.name)}`)
    ].join('\n'));
  }

  savePlayerPosition(time, player) {
    this.positions.push({time, x: player.x, y: player.y});
  }

  savePlayerSpeed(time, speedX, speedY) {
    this.speedRecords.push({ time, speedX, speedY });
    this.speedRecords = this.speedRecords.filter(record => record.time + 1000 >= time);
  }

  cleanupOldPositions(time, delta = 1000) {
    this.positions = this.positions.filter(record => record.time + delta >= time);
  }

  getSpeed() {
    const [minTime, maxTime] = getMinMaxRecord(this.positions, ({ time }) => time);
    const [minX, maxX] = getMinMaxRecord(this.positions, rec => rec.x);
    const [minY, maxY] = getMinMaxRecord(this.positions, rec => rec.y);
    const time = (maxTime - minTime) / 1000;
    const horizontalDistance = maxX - minX;
    const verticalDistance = maxY - minY;
    return [
      Math.round(horizontalDistance / time),
      Math.round(verticalDistance / time)
    ];
  }

  getDelta() {
    const [minTime, maxTime] = getMinMaxRecord(this.speedRecords, ({ time }) => time);
    const [minSpeedX, maxSpeedX] = getMinMaxRecord(this.speedRecords, rec => rec.speedX);
    const [minSpeedY, maxSpeedY] = getMinMaxRecord(this.speedRecords, rec => rec.speedY);
    const time = (maxTime - minTime) / 1000;
    const deltaX = maxSpeedX - minSpeedX;
    const deltaY = maxSpeedY - minSpeedY;
    return [
      Math.round(deltaX / time),
      Math.round(deltaY / time)
    ];
  }
}

const getMinMaxRecord = (prop, mapper) => prop.map(mapper).reduce(
  ([min, max], value) => [
    Math.min(min, value),
    Math.max(max, value)
  ],
  [Infinity, 0]
);
