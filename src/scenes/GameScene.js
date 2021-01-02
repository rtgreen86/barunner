import { Scene } from 'Phaser';

import backgroundLayer1 from '../../assets/images/background-layer-1.png'
import backgroundLayer2 from '../../assets/images/background-layer-2.png'
import backgroundLayer3 from '../../assets/images/background-layer-3.png'

import spritesheet from '../../assets/images/spritesheet.png';
import ground from '../../assets/images/ground.png';

import sheepSpritesheet from '../../assets/sheep-spritesheet.png';

import Player from '../classes/Player';
import ChunkGroup from '../classes/ChunkGroup';

export default class GameScene extends Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background-layer-1', backgroundLayer1);
    this.load.image('background-layer-2', backgroundLayer2);
    this.load.image('background-layer-3', backgroundLayer3);
    this.load.image('image-ground', ground);

    this.load.spritesheet('spritesheet-50', spritesheet, {
      frameWidth: 50,
      frameHeight: 50,
      startFrame: 0,
      endFrame: 399
    });

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
    this.player = new Player(this, 300, 510, 'spritesheet-50', 1, this.cursor);
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
      key: 'ram-idle',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [1, 2, 3, 4] }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'ram-jump',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [28, 29, 30, 31, 32] }),
      frameRate: 20,
    });
    this.anims.create({
      key: 'ram-fall',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [33, 34] }),
      frameRate: 20
    });
    this.anims.create({
      key: 'ram-landing',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [35] }),
      frameRate: 20
    });
    this.anims.create({
      key: 'ram-run',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [6, 7, 8, 9, 10, 11] }),
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
