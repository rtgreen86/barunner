import Phaser from 'Phaser';

const getMax = values => values.reduce((max, value) => Math.max(max, value));

const getMin = values => values.reduce((min, value) => Math.min(min, value));

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this.messages = [];

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

    const playerX = Math.floor(this.gameScene.player.x);
    const playerY = Math.floor(this.gameScene.player.y);
    this.data.set('player position', `(${playerX}, ${playerY})`);

    if (!this.data.values.speed) {
      this.data.set('speed', '');
    }

    this.data.inc('_speedTestTime', delta2);
    if (this.data.values._speedTestTime > 300) {
      const seconds = 1000 / this.data.values._speedTestTime;
      const prevX = this.data.values._prevX || playerX;
      const speedX = Math.abs(Math.floor((playerX - prevX) * seconds));
      const prevSpeedX = this.data.values._prevSpeedX || speedX;
      const deltaX = speedX - prevSpeedX;
      const prevY = this.data.values._prevY || playerY;
      const speedY = Math.abs(Math.floor((playerY - prevY) * seconds));
      const prevSpeedY = this.data.values._prevSpeedY || speedY;
      const deltaY = speedY - prevSpeedY;
      this.data.set('speed', `h ${speedX} (delta ${deltaX.toPrecision(3)}); v ${speedY} (delta ${deltaY.toPrecision(3)})`);
      this.data.set('_prevX', playerX);
      this.data.set('_prevSpeedX', speedX);
      this.data.set('_prevY', playerY);
      this.data.set('_prevSpeedY', speedY);
      this.data.set('_speedTestTime', 0);
    }

    const activeObstacles = this.gameScene.obstacles2.countActive();
    const inactiveObstacles = this.gameScene.obstacles2.countActive(false);
    const totalObstacles = this.gameScene.obstacles2.getLength();
    this.data.set('obstacles', `active ${activeObstacles}; inactive ${inactiveObstacles}; total ${totalObstacles}`);

    const cameraX = Math.floor(this.gameScene.cameras.main.scrollX);
    const cameraY = Math.floor(this.gameScene.cameras.main.scrollY);
    this.data.set('camera position', `x ${cameraX}; y ${cameraY}`);

    const ground = this.gameScene.map.layer.tilemapLayer;
    this.data.set('ground', `x ${ground.x}; y ${ground.y}; width ${ground.width}`);

    this.messages.splice(0, this.messages.length - 10);
    this.data.set('messages', `\n${this.messages.join('\n')}`);





    this.data.set('_playerX', Math.floor(this.gameScene.player.x));
    this.data.set('_playerY', Math.floor(this.gameScene.player.y));




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
    this.messages.push(message);
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

