import Phaser from 'Phaser';

const getMax = values => values.reduce((max, value) => Math.max(max, value));

const getMin = values => values.reduce((min, value) => Math.min(min, value));

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this.positions = [];
    this.speedRecords = [];
    this.message = [];
  }

  create() {
    this.text = this.createText(0, 0, 'Debug Information');
    this.keyO = this.createKey(Phaser.Input.Keyboard.KeyCodes.O, this.onCreateObstaclePressed);
    this.gameScene = this.scene.get('GameScene');
    this.gameScene.events.on('debugMessage', this.handleDebugMessage, this);
    this.events.on('changedata', this.handleDataUpdated, this);
  }

  update(time, delta2) {
    this.data.set('time', Math.floor(time));
    this.data.set('_playerX', Math.floor(this.gameScene.player.x));
    this.data.set('_playerY', Math.floor(this.gameScene.player.y));
    this.data.set('active chunk', this.gameScene.playerChunk);
    this.data.set('player position', `(${this.data.values._playerX}, ${this.data.values._playerY})`);
    this.data.set('speedX', Math.abs(Math.floor((this.data.values._playerX - this.data.values._prevPlayerX) * (1000 / delta2))));
    this.data.set('speedY', Math.abs(Math.floor((this.data.values._playerY - this.data.values._prevPlayerY) * (1000 / delta2))));
    this.data.inc('_time', delta2);

    this.data.set('_playerPosition', {
      x: Math.floor(this.gameScene.player.x),
      y: Math.floor(this.gameScene.player.y)
    });



    // this.savePlayerPosition(time);
    // this.cleanupOldPositions(time);

    const speed = this.getSpeed();

    const [speedX, speedY] = speed;
    this.savePlayerSpeed(time, speedX, speedY);
    const delta = this.getDelta();
    this.updateDebugInfo({
      time,
      speed,
      delta
    });

    const text = Object.entries(this.data.query(/^[a-zA-Z]/))
      .reduce((builder, [key, value]) => {
        builder.push(`${key}: ${value}`);
        return builder;
      }, [])
      .join('\n');

    this.text.setText(text + '\n\n' + this.text.text);
  }

  getPlayerPosition() {
    const x = Math.floor(this.gameScene.player.x);
    const y = Math.floor(this.gameScene.player.y);
    const chunk = this.gameScene.playerChunk;
    return `(${x}, ${y}), chunk: ${chunk}`;
  }

  createText(x, y, message) {
    return this.add.text(x, y, message)
      .setFontSize('24px')
      .setColor('black');
  }

  createKey(key, handler) {
    return this.input.keyboard.addKey(key, true, false).on('down', handler, this);
  }

  updateDebugInfo({ time, speed, delta }) {
    const gameScene = this.scene.get('GameScene');
    const ground = gameScene.map.layer.tilemapLayer;
    this.text.setText([
      `Speed (h,v): ${speed.join()} pps`,
      `Delta: ${delta.join(', ')}`,
      `Obstacles: ${gameScene.obstacles2.countActive()}, ${gameScene.obstacles2.countActive(false)} ${gameScene.obstacles2.getLength()}`,
      `Camera X: ${gameScene.cameras.main.scrollX}`,
      `Ground X, W: ${ground.x}, ${ground.width}`,
      'Layers:',
      'Messages:',
      ...this.message
      // ...gameScene.level.layers.map(layerData => `${layerData.name} ${layerData.tilemapLayer.x} ${gameScene.getLayerPosition(layerData.name)}`)
    ].join('\n'));
  }

  savePlayerPosition(time) {
    this.positions.push({
      time,
      x: this.gameScene.player.x,
      y: this.gameScene.player.y
    });
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

  onCreateObstaclePressed() {
    const gameScene = this.scene.get('GameScene');
    const player = gameScene.player;
    const x = player.x + 500;
    const y = player.y;
    gameScene.getObstacle(x, y);
  }

  handleDebugMessage(message) {
    this.message.push(message);
    while(this.message.length > 3) this.message.shift();
  }

  handleDataUpdated(scene, key, value, prevValue) {
    switch(key) {
      case 'time':
        this.data.set('_prevTime', prevValue);
        break;
      case '_playerX':
        this.data.set('_prevPlayerX', prevValue);
        break;
      case '_playerY':
        this.data.set('_prevPlayerY', prevValue);
        break;
      case '_time':
        if (value > 300) {
          this.data.set('speedX2', Math.abs(Math.floor((this.data.values._playerX - this.data.values._lastX) / value * 1000)));
          this.data.set('speedY2', Math.abs(Math.floor((this.data.values._playerY - this.data.values._lastY) / value * 1000)));
          this.data.set('_lastX', this.data.values._playerX);
          this.data.set('_lastY', this.data.values._playerY);
          this.data.set('_time', 0);
        }
        break;
      case '_playerPosition':
        this.positions.push({
          time: scene.data.values.time,
          x: value.x,
          y: value.y
        });
        this.positions = this.positions.filter(record => record.time + 5000 >= scene.data.values.time);
        break;
    }
  }
}

const getMinMaxRecord = (prop, mapper) => prop.map(mapper).reduce(
  ([min, max], value) => [
    Math.min(min, value),
    Math.max(max, value)
  ],
  [Infinity, 0]
);

