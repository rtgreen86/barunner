import Phaser from 'Phaser';

import RAM_SPRITESHEET_JSON from '../../assets/images/ram-spritesheet.json';
import RAM_SPRITESHEET_PNG from '../../assets/images/ram-spritesheet.png';

import backgroundLayer1 from '../../assets/images/background-layer-1.png'
import backgroundLayer2 from '../../assets/images/background-layer-2.png'
import backgroundLayer3 from '../../assets/images/background-layer-3.png'
import ground from '../../assets/images/ground.png';

import spritesheet from '../../assets/images/spritesheet.png';
import spritesheet64 from '../../assets/images/spritesheet-64.png';

import jump from '../../assets/sound/jump.wav';

import Level1 from '../entities/levels/Level1';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.aseprite('ram-spritesheet', RAM_SPRITESHEET_PNG, RAM_SPRITESHEET_JSON);
    Level1.preload(this);
    this.loadImages();
    this.loadSpriteSheets();
    this.loadSounds();
  }

  loadImages() {
    this.load.image('background-layer-1', backgroundLayer1);
    this.load.image('background-layer-2', backgroundLayer2);
    this.load.image('background-layer-3', backgroundLayer3);
    this.load.image('image-ground', ground);
  }

  loadSpriteSheets() {
    this.load.spritesheet('spritesheet-small', spritesheet, {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 0,
      endFrame: 59
    });
    this.load.spritesheet('spritesheet-large', spritesheet, {
      frameWidth: 128,
      frameHeight: 128,
      startFrame: 15,
      endFrame: 25
    });
    this.load.spritesheet('spritesheet-64', spritesheet64, {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  loadSounds() {
    this.load.audio('jump', [jump]);
  }

  create() {
    this.text = this.add.text(0, 0, 'Hello World');
    this.text.setFontSize('24px');
    // this.scene.start('Game');
    this.scene.run('Game');
  }
}