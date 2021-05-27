import Phaser from 'Phaser';

import backgroundLayer1 from '../../assets/images/background-layer-1.png'
import backgroundLayer2 from '../../assets/images/background-layer-2.png'
import backgroundLayer3 from '../../assets/images/background-layer-3.png'
import ground from '../../assets/images/ground.png';

import spritesheet from '../../assets/images/spritesheet.png';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }


  preload() {
    this.loadImages();
    this.loadSpriteSheets();
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
  }

  create() {
    this.scene.start('Game');
  }
}