import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this.messages = [];
  }

  init(data) {
    this.watchScene = this.scene.get(data.watch);
    this.events.on('logged', this.handleDebugMessage, this);
  }

  create() {
    this.text = this.add.text(0, 40)
      .setFontSize('24px').setColor('black');
    this.keyObstacle = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O, true, false)
      .on('down', this.handleObstaclePressed, this);
  }

  update(time, delta2) {
    this.data.set('time', Math.floor(time));

    const [playerX, playerY] = this.getPlayerPosition();
    this.data.set('player position', this.getPlayerPositionText());

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

    const cameraX = Math.floor(this.watchScene.cameras.main.scrollX);
    const cameraY = Math.floor(this.watchScene.cameras.main.scrollY);
    this.data.set('camera position', `x ${cameraX}; y ${cameraY}`);

    const ground = this.watchScene.map.layer.tilemapLayer;
    this.data.set('ground', `x ${ground.x}; y ${ground.y}; width ${ground.width}`);

    this.data.set('messages', this.getMessagesText());

    this.text.setText(this.getDebugText());
  }

  getPlayerPosition() {
    return [Math.floor(this.watchScene.player.x), Math.floor(this.watchScene.player.y)];
  }

  getPlayerPositionText() {
    const [playerX, playerY] = this.getPlayerPosition();
    return `(${playerX}, ${playerY})`;
  }

  getMessagesText() {
    return `\n${this.messages.join('\n')}`;
  }

  getDebugText() {
    return Object.entries(this.data.query(/^[a-zA-Z]/))
      .reduce((builder, [key, value]) => {
        builder.push(`${key}: ${value}`);
        return builder;
      }, [])
      .join('\n');
  }

  log(message) {
    this.events.emit('logged', message);
  }

  handleObstaclePressed() {
    const player = this.watchScene.player;
    const x = player.x + 500;
    const y = player.y;
    this.watchScene.getObstacle(x, y);
  }

  handleDebugMessage(message) {
    console.log(...arguments);
    this.messages.push(message);
    this.messages.splice(0, this.messages.length - 10);
  }
}
