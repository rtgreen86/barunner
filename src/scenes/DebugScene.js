import Phaser from 'Phaser';

export default class DebugScene extends Phaser.Scene {
  constructor(name = 'DebugScene') {
    super(name);
    this.messages = [];
  }

  create() {
    this.text = this.createText(0, 0, 'Debug Information');
    this.keyO = this.createKey(Phaser.Input.Keyboard.KeyCodes.O, this.onCreateObstaclePressed);
    this.gameScene = this.scene.get('GameScene');
    this.gameScene.events.on('debugMessage', this.handleDebugMessage, this);
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

    const text = Object.entries(this.data.query(/^[a-zA-Z]/))
      .reduce((builder, [key, value]) => {
        builder.push(`${key}: ${value}`);
        return builder;
      }, [])
      .join('\n');

    this.text.setText(text);
  }

  createText(x, y, message) {
    return this.add.text(x, y, message)
      .setFontSize('24px')
      .setColor('black');
  }

  createKey(key, handler) {
    return this.input.keyboard.addKey(key, true, false).on('down', handler, this);
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
}
