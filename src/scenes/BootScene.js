import Phaser from 'Phaser';

import LEVEL_1_MAP_JSON from '../../assets/map/level-1-map.json';
import LEVEL_1_TILESET_PNG from '../../assets/images/level-1-tileset.png';

import RAM_SPRITESHEET_JSON from '../../assets/images/ram-spritesheet.json';
import RAM_SPRITESHEET_PNG from '../../assets/images/ram-spritesheet.png';
import OBSTACLE_PNG from '../../assets/images/obstacle.png';

import backgroundLayer1 from '../../assets/images/background-layer-1.png'
import backgroundLayer2 from '../../assets/images/background-layer-2.png'
import backgroundLayer3 from '../../assets/images/background-layer-3.png'
import ground from '../../assets/images/ground.png';

import spritesheet from '../../assets/images/spritesheet.png';
import spritesheet64 from '../../assets/images/spritesheet-64.png';

import jump from '../../assets/sound/jump.wav';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.aseprite('ram-spritesheet', RAM_SPRITESHEET_PNG, RAM_SPRITESHEET_JSON);
    this.loadMaps();
    this.loadImages();
    this.loadSpriteSheets();
    this.loadSounds();
  }

  loadMaps() {
    this.load.tilemapTiledJSON('map-level-1', LEVEL_1_MAP_JSON);
  }

  loadImages() {
    this.load.image('tileset-level-1', LEVEL_1_TILESET_PNG);
    this.load.image('background-layer-1', backgroundLayer1);
    this.load.image('background-layer-2', backgroundLayer2);
    this.load.image('background-layer-3', backgroundLayer3);
    this.load.image('image-ground', ground);
    this.load.spritesheet('obstacle-png', OBSTACLE_PNG, { frameWidth: 128, frameHeight: 128 });
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
    console.log('boot scene create');
    this.scene.run('GameScene');
    this.scene.run('DebugScene');
  }
}