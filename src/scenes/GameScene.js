import { Scene } from 'Phaser';

// import resources
import sheepSpritesheet from '../../assets/sheep-spritesheet.png';
import imageGround from '../../assets/ground.png';
import layer1 from '../../assets/layer1.png';

import Player from '../classes/Player';
import Ground from '../classes/Ground';
import ChunkGroup from '../classes/ChunkGroup';

export default class GameScene extends Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.spritesheet('sheep-spritesheet', sheepSpritesheet, {
      frameWidth: 60,
      frameHeight: 60,
      startFrame: 0,
      endFrame: 63
    });
    this.load.image('bg-layer1', layer1);
    this.load.image('image-ground', imageGround);
  }

  init() {
    this.gameStarted = false;
  }

  create() {
    this.createAnimations();
    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = this.input.keyboard.createCursorKeys();

    // this.ground = new Ground(this);

    this.background1 = new ChunkGroup(this, 0, 500, 'bg-layer1', 400, 194, 3);
    this.background1.setScrollFactor(0.2, 0.2);

    this.ground = new ChunkGroup(this, 0, 560, 'image-ground', 200, 75, 4);

    this.player = new Player(this, 300, 506, 'sheep-spritesheet', null, this.cursor);
    this.physics.add.collider(this.ground, this.player);
    this.camera();

  }

  camera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.startFollow(
      this.player,
      false,
      1, 0,
      -200, 220
    );
  }

  createAnimations() {
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
  }

  update(time, delta) {
    this.updateDeadline();
    this.player.update(time, delta);
    this.ground.update();
    this.background1.update();
  }

  updateDeadline() {
    this.deadline = this.cameras.main.scrollX - 200;
  }
}
