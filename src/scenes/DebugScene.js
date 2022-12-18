import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this._messages = [];
  }

  init(data) {
    this._watchScene = this.scene.get(data.watch);
    this._watchScene.events.on('debugMessage', this.handleDebugMessage, this);
  }

  create() {
    this._text = this.add.text(0, 0)
      .setFontSize('24px').setColor('black');
    this._keyObstacle = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O, true, false)
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

    const activeObstacles = this._watchScene.obstacles2.countActive();
    const inactiveObstacles = this._watchScene.obstacles2.countActive(false);
    const totalObstacles = this._watchScene.obstacles2.getLength();
    this.data.set('obstacles', `active ${activeObstacles}; inactive ${inactiveObstacles}; total ${totalObstacles}`);

    const cameraX = Math.floor(this._watchScene.cameras.main.scrollX);
    const cameraY = Math.floor(this._watchScene.cameras.main.scrollY);
    this.data.set('camera position', `x ${cameraX}; y ${cameraY}`);

    const ground = this._watchScene.map.layer.tilemapLayer;
    this.data.set('ground', `x ${ground.x}; y ${ground.y}; width ${ground.width}`);

    this.data.set('messages', this.getMessagesText());

    this._text.setText(this.getDebugText());
  }

  getPlayerPosition() {
    return [Math.floor(this._watchScene.player.x), Math.floor(this._watchScene.player.y)];
  }

  getPlayerPositionText() {
    const [playerX, playerY] = this.getPlayerPosition();
    return `(${playerX}, ${playerY})`;
  }

  getMessagesText() {
    this._messages.splice(0, this._messages.length - 10);
    return `\n${this._messages.join('\n')}`;
  }

  getDebugText() {
    return Object.entries(this.data.query(/^[a-zA-Z]/))
      .reduce((builder, [key, value]) => {
        builder.push(`${key}: ${value}`);
        return builder;
      }, [])
      .join('\n');
  }

  handleObstaclePressed() {
    const player = this._watchScene.player;
    const x = player.x + 500;
    const y = player.y;
    this._watchScene.getObstacle(x, y);
  }

  handleDebugMessage(message) {
    this._messages.push(message);
  }
}
