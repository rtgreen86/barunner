import { Game, AUTO, Scene } from 'Phaser';

import imageSheepIdle from '../assets/sheep-idle.png';

const scene = new Scene('game');

scene.preload = function () {
  this.load.spritesheet('sheep-idle', imageSheepIdle, {
    frameWidth: 325,
    frameHeight: 300,
    startFrame: 0,
    endFrame: 3
  });
};

scene.create = function () {
  this.player = this.physics.add.image(325, 300, 'sheep-idle');
  this.player.setScale(0.2);
  this.cameras.main.setBackgroundColor('rgba(100, 180, 250, 1)');
};

scene.update = function (time, delta) {
  this.playerDelta = (this.playerDelta || 0) + delta;
  if (this.playerDelta >= 250) {
    this.playerDelta = 0;
    this.playerFrame = (this.playerFrame || 0) + 1;
    if (this.playerFrame > 3) {
      this.playerFrame = 0;
    }
    this.player.setFrame(this.playerFrame);
  }
}

new Game({
  type: AUTO,
  width: 1024,
  height: 600,
  scene,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { x: 0, y: 0 }
    }
  }
});
