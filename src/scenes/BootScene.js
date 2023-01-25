import Phaser from 'Phaser';

import FILE_BACKGROUND_LAYER_1_PNG from '../../assets/images/background-layer-1.png'
import FILE_BACKGROUND_LAYER_2_PNG from '../../assets/images/background-layer-2.png'
import FILE_LEVEL_1_MAP_JSON from '../../assets/map/level-1-map.json';
import FILE_LEVEL_1_TILESET_PNG from '../../assets/images/level-1-tileset.png';
import FILE_OBJECTS_JSON from '../../assets/images/objects.json';
import FILE_OBJECTS_PNG from '../../assets/images/objects.png';
import FILE_RAM_SPRITESHEET_JSON from '../../assets/images/ram-spritesheet.json';
import FILE_RAM_SPRITESHEET_PNG from '../../assets/images/ram-spritesheet.png';
import FILE_JUMP_WAV from '../../assets/sound/jump.wav';

import FILE_BUTTON_GREEN_IMAGE from '../../assets/images/ui/button_green_250.png';
import FILE_BUTTON_X_IMAGE from '../../assets/images/ui/button_x_120.png';
import FILE_SWITCH_IMAGE from '../../assets/images/ui/switch_100.png';
import FILE_SWITCH_SPRITE from '../../assets/images/ui/switch_100.json';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
      active: true
    });
  }

  preload() {
    this.load.image('background-layer-1', FILE_BACKGROUND_LAYER_1_PNG);
    this.load.image('background-layer-2', FILE_BACKGROUND_LAYER_2_PNG);
    this.load.image('level-1-tileset', FILE_LEVEL_1_TILESET_PNG);
    this.load.aseprite('ram-spritesheet', FILE_RAM_SPRITESHEET_PNG, FILE_RAM_SPRITESHEET_JSON);
    this.load.aseprite('objects-spritesheet', FILE_OBJECTS_PNG, FILE_OBJECTS_JSON);
    this.load.tilemapTiledJSON('map-level-1', FILE_LEVEL_1_MAP_JSON);
    this.load.audio('jump', [FILE_JUMP_WAV]);
    this.load.image('button-green', FILE_BUTTON_GREEN_IMAGE);
    this.load.image('button-x', FILE_BUTTON_X_IMAGE);
    this.load.aseprite('switch', FILE_SWITCH_IMAGE, FILE_SWITCH_SPRITE);
  }

  create() {
    // Run debug output
    // this.scene.run('DebugScene', {
    //   watch: 'GameScene'
    // });

    this.scene.run('GameScene');
    this.scene.run('ScoreboardScene', { game: 'GameScene' });
  }
}
