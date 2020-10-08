import { Game, AUTO, Scene } from 'Phaser';

import imageSheepIdle from '../assets/sheep-idle.png';
import imageGround from '../assets/ground.png';

const scene = new Scene('game');

scene.preload = function () {
  this.load.spritesheet('ss-sheep-idle', imageSheepIdle, {
    frameWidth: 325,
    frameHeight: 300,
    startFrame: 0,
    endFrame: 3
  });
  this.load.image('image-ground', imageGround);
};

scene.create = function () {
  this.anims.create({
    key: 'sheep-idle',
    frames: this.anims.generateFrameNumbers('ss-sheep-idle', { frames: [0, 1, 2, 3] }),
    frameRate: 4,
    repeat: -1
  });

  this.ground = this.physics.add.staticImage(0, 500, 'image-ground');
  this.ground.setSize(200, 50);

  this.player = this.physics.add.sprite(0, 300, 'ss-sheep-idle');
  this.player.setScale(0.25);
  this.player.setSize(300, 200);
  this.player.play('sheep-idle');

  this.physics.add.collider(this.ground, this.player);

  this.cameras.main.setBackgroundColor('rgba(100, 180, 250, 1)');
  this.cameras.main.startFollow(
    this.player,  // target
    false,        // roundPixels
    1, 0.7,         // lerpX, lerpY
    -200, 100          // offsetX, offsetY
  );
};

scene.update = function () {
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
      gravity: { x: 0, y: 500 }
    }
  }
});
