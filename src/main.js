import { Game, AUTO, Scene } from 'Phaser';

import sheepSpritesheet from '../assets/sheep-spritesheet.png';
import imageGround from '../assets/ground.png';
import './main.css';


const scene = new Scene('game');

scene.preload = function () {
  this.load.spritesheet('sheep-spritesheet', sheepSpritesheet, {
    frameWidth: 120,
    frameHeight: 120,
    startFrame: 0,
    endFrame: 15
  });
  this.load.image('image-ground', imageGround);
};

scene.create = function () {
  this.anims.create({
    key: 'sheep-idle',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [0, 1, 2, 3] }),
    frameRate: 4,
    repeat: -1
  });

  this.anims.create({
    key: 'sheep-jump-up',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [4, 5, 6, 7, 8] }),
    frameRate: 8,
  });

  this.anims.create({
    key: 'sheep-jump-down',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [9, 10, 11] }),
    frameRate: 8
  });

  this.ground = this.physics.add.staticImage(0, 560, 'image-ground');
  this.ground.setSize(200, 75);

  this.player = this.physics.add.sprite(0, 507, 'sheep-spritesheet');
  this.player.setScale(0.5);
  this.player.setSize(100, 50);
  this.player.play('sheep-idle');
  this.player.status = 'idle';

  this.physics.add.collider(this.ground, this.player);

  this.cameras.main.setBackgroundColor('rgba(100, 180, 250, 1)');
  this.cameras.main.startFollow(
    this.player,  // target
    false,        // roundPixels
    1, 0,         // lerpX, lerpY
    -200, 220          // offsetX, offsetY
  );

  this.cursor = this.input.keyboard.createCursorKeys();
};

scene.update = function () {
  if (this.cursor.up.isDown) {
    this.player.body.setVelocityY(-300);
  }
  if (this.cursor.up.isDown && this.player.status === "idle") {
    this.player.play('sheep-jump-up', true, 0);
    this.player.status = 'jumping';
  }
  if (this.player.body.velocity.y < 10 && this.player.body.velocity.y > -10 && this.player.status === 'idle') {
    this.player.play('sheep-idle', true);
  }
  if (this.player.body.velocity.y > 10) {
    this.player.play('sheep-idle', true);
    this.player.play('sheep-jump-down', true, 0);
    this.player.status = 'idle';
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
      gravity: { x: 0, y: 1000 }
    }
  }
});
