import { Scene } from 'Phaser';

import backgroundLayerImage1 from '../../assets/background-layer-1.png'
import backgroundLayerImage2 from '../../assets/background-layer-2.png'
import backgroundLayerImage3 from '../../assets/background-layer-3.png'

import sheepSpritesheet from '../../assets/sheep-spritesheet.png';
import imageGround from '../../assets/ground.png';

import Player from '../classes/Player';
import ChunkGroup from '../classes/ChunkGroup';

export default class GameScene extends Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background-layer-1', backgroundLayerImage1);
    this.load.image('background-layer-2', backgroundLayerImage2);
    this.load.image('background-layer-3', backgroundLayerImage3);

    this.load.image('image-ground', imageGround);

    this.load.spritesheet('sheep-spritesheet', sheepSpritesheet, {
      frameWidth: 60,
      frameHeight: 60,
      startFrame: 0,
      endFrame: 63
    });
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

    this.createBackground();
    this.createForeground();
    this.createPlayer();

    this.physics.add.collider(this.ground, this.player);
    this.camera();
  }

  createBackground() {
    this.backgroundLayers = [
      (new ChunkGroup(this, 0, 600, 'background-layer-1', 533, 350, 5)).setScrollFactor(0.2, 0.2).setOrigin(0.5, 1),
      (new ChunkGroup(this, 0, 600, 'background-layer-2', 533, 350, 5)).setScrollFactor(0.5, 0.5).setOrigin(0.5, 1),
      new ChunkGroup(this, 0, 600, 'background-layer-3', 1389, 350, 3).setOrigin(0.5, 1)
    ];
  }

  createForeground() {
    this.ground = new ChunkGroup(this, 0, 562.5, 'image-ground', 200, 75, 15);
  }

  createPlayer() {
    this.player = new Player(this, 300, 507.5, 'sheep-spritesheet', null, this.cursor);
  }

  camera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.startFollow(
      this.player,
      false,
      0.2, 0,
      -200, 207,5
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
    this.player.update(time, delta);
    this.ground.update();
    this.backgroundLayers.forEach(item => item.update());
  }
}
