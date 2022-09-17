import Phaser from 'Phaser';

import backgroundLayer1 from '../../assets/images/background-layer-1.png'
import backgroundLayer2 from '../../assets/images/background-layer-2.png'
import backgroundLayer3 from '../../assets/images/background-layer-3.png'
import ground from '../../assets/images/ground.png';

import tilesMap5 from '../../assets/map/tiles-map-5.png';
import map5 from '../../assets/map/map-5-1.json';

import tilesetLevel1 from '../../assets/images/tileset-level-1-128.png';
import mapLevel1 from '../../assets/map/level-1-map.json';

import spritesheet from '../../assets/images/spritesheet.png';
import spritesheet64 from '../../assets/images/spritesheet-64.png';
import spritesheet64Tiles from '../../assets/images/spritesheet-64.json';

import ramSpritesheet128 from '../../assets/images/ram-spritesheet-128.png';
import ramSpritesheetData128 from '../../assets/sprites/ram-spritesheet-128.json';

import ramSpritesheet128a from '../../assets/images/ram-spritesheet-128a.png';
import ramSpritesheetData128a from '../../assets/sprites/ram-spritesheet-128a.json';

import jump from '../../assets/sound/jump.wav';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.loadImages();
    this.loadSpriteSheets();
    this.loadSounds();
    this.load.tilemapTiledJSON('mappy', map5);
    this.load.tilemapTiledJSON('map-level-1', mapLevel1);
  }

  loadImages() {
    this.load.image('background-layer-1', backgroundLayer1);
    this.load.image('background-layer-2', backgroundLayer2);
    this.load.image('background-layer-3', backgroundLayer3);
    this.load.image('image-ground', ground);
    this.load.image('terrain', tilesMap5);
    this.load.image('tileset-level-1', tilesetLevel1);
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
    this.load.json('spritesheet-64-tiles', spritesheet64Tiles, 'tiles');

    this.load.spritesheet('ram-spritesheet-128.png', ramSpritesheet128, {
      frameWidth: 256,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 37
    });
    this.load.json('ram-spritesheet-data-128.json', ramSpritesheetData128);

    this.load.aseprite('ram-aseprite', ramSpritesheet128a, ramSpritesheetData128a);
  }

  loadSounds() {
    this.load.audio('jump', [jump]);
  }

  create() {
    this.scene.start('Game');
  }
}