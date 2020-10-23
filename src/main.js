import { Game, AUTO, Scene } from 'Phaser';

import sheepSpritesheet from '../assets/sheep-spritesheet.png';
import imageGround from '../assets/ground.png';
import './main.css';

const scene = new Scene('game');

scene.preload = function () {
  this.load.spritesheet('sheep-spritesheet', sheepSpritesheet, {
    frameWidth: 60,
    frameHeight: 60,
    startFrame: 0,
    endFrame: 63
  });
  this.load.image('image-ground', imageGround);
};

scene.create = function () {
  this.gameStarted = false;

  this.anims.create({
    key: 'sheep-idle',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [0, 1, 2, 3] }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'sheep-jump-up',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [5, 6, 7, 8, 9] }),
    frameRate: 20,
  });

  this.anims.create({
    key: 'sheep-jump-down',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [10, 11, 12] }),
    frameRate: 20
  });

  this.anims.create({
    key: 'sheep-run',
    frames: this.anims.generateFrameNumbers('sheep-spritesheet', { frames: [16, 17, 18, 19, 20, 21] }),
    frameRate: 20,
    repeat: -1
  });

  this.ground = this.physics.add.staticGroup();
  this.ground.add(this.physics.add.staticImage(0, 560, 'image-ground'));
  this.ground.add(this.physics.add.staticImage(200, 560, 'image-ground'));
  this.ground.add(this.physics.add.staticImage(400, 560, 'image-ground'));
  this.ground.add(this.physics.add.staticImage(600, 560, 'image-ground'));
  this.lastGround = 800;

  this.player = this.physics.add.sprite(300, 506, 'sheep-spritesheet');

  // player can be scaled
  // this.player.setScale(0.5);

  this.player.setSize(50, 35);
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

  // use Phaser.Input.Keyboard. KeyboardPlugin
  // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
  // An object containing the properties: up, down, left, right, space and shift.
  this.cursor = this.input.keyboard.createCursorKeys();
};

scene.update = function (time, delta) {
  if (this.player.status === 'jumping') {
    this.player.jumpTime += delta;
  }
  if (
    (this.player.status === 'running' || this.player.status === 'idle') &&
    this.cursor.space.isDown
  ) {
    // start jumping
    this.player.play('sheep-jump-up', true, 0);
    this.player.status = 'jumping';
    this.player.jumpTime = 0;
    this.gameStarted = true;
  }
  if (this.player.status === 'jumping' && this.cursor.space.isDown && this.player.jumpTime <= 300) {
    this.player.body.setVelocityY(-300);
  }
  if (this.player.status === 'falling' && this.player.body.velocity.y === 0) {
    this.player.status = 'idle';
  }
  if (this.player.status === 'idle' && this.player.body.velocity.y === 0 && this.gameStarted) {
    this.player.status = 'running';
    this.player.setVelocityX(500);
  }
  if (this.player.body.velocity.y > 0 && this.player.status !== 'falling') {
    this.player.status = 'falling';
    this.player.play('sheep-jump-down', true);
  }
  if (this.player.status === 'idle') {
    this.player.play('sheep-idle', true);
  }
  if (this.player.status === 'running') {
    this.player.play('sheep-run', true);

  }
  this.rebuildScene();
}

scene.rebuildScene = function () {
  const cameraPosition = this.cameras.main.scrollX;
  const destroyLine = cameraPosition - 200;
  const groundItems = this.ground.getChildren();
  for (let i = 0; i < groundItems.length; i++) {
    if (groundItems[i].x < destroyLine) {
      groundItems[i].setActive(false);
      groundItems[i].setVisible(false);
    }
  }
  const unusedGround = this.ground.getFirstDead(false, this.lastGround, 560);
  if (unusedGround) {
    this.lastGround += 200;
    unusedGround.setActive(true);
    unusedGround.setVisible(true);
    unusedGround.refreshBody();
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
