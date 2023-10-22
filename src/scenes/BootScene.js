import Phaser from 'phaser';

import FILE_BACKGROUND_LAYER_1_PNG from '../../assets/images/background-layer-1.png'
import FILE_BACKGROUND_LAYER_2_PNG from '../../assets/images/background-layer-2.png'
import FILE_LEVEL_1_MAP_JSON from '../../assets/map/level-1-map.json';
import FILE_LEVEL_1_TILESET_PNG from '../../assets/images/level-1-tileset.png';
import FILE_OBJECTS_JSON from '../../assets/images/objects.json';
import FILE_OBJECTS_PNG from '../../assets/images/objects.png';
import FILE_RAM_SPRITESHEET_JSON from '../../assets/images/ram-spritesheet.json';
import FILE_RAM_SPRITESHEET_PNG from '../../assets/images/ram-spritesheet.png';
import FILE_JUMP_WAV from '../../assets/sound/jump.wav';
import FILE_MODAL_DIALOG from '../../assets/images/dialog.png'
import FILE_BUTTONS from '../../assets/images/buttons.png';
import FILE_POINTER_JSON from '../../assets/images/pointer-64.json';
import FILE_POINTER_PNG from '../../assets/images/pointer-64.png';
import FILE_BUTTON_GRAY from '../../assets/images/button-gray.png'
import FILE_WIDE_BUTTON_JSON from '../../assets/images/wide-buttons.json'
import FILE_WIDE_BUTTON_PNG from '../../assets/images/wide-buttons.png'

import FILE_SWITCH_IMAGE from '../../assets/images/ui/switch_100.png';
import FILE_SWITCH_SPRITE from '../../assets/images/ui/switch_100.json';

import FILE_BUTTON_GREEN from '../../assets/images/ui/button_green.png';
import FILE_BUTTON_YELLOW from '../../assets/images/ui/button_yellow.png';
import FILE_BUTTON_RED from '../../assets/images/ui/button_red.png';
import FILE_BUTTON_X from '../../assets/images/ui/button_x.png';
import FILE_SWITCH_ANIMATED from '../../assets/images/ui/switch_animated.png';
import FILE_SWITCH_ANIMATED_JSON from '../../assets/images/ui/switch_animated.json';
import FILE_DIALOG_BG from '../../assets/images/ui/dialog_bg.png';
import FILE_DIALOG_FRAME from '../../assets/images/ui/dialog_frame.png';

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
    this.load.image('modal-dialog', FILE_MODAL_DIALOG);

    this.load.spritesheet('buttons', FILE_BUTTONS, { frameWidth: 256, frameHeight: 100 });
    this.load.image('button-gray', FILE_BUTTON_GRAY);

    this.load.aseprite('ram-spritesheet', FILE_RAM_SPRITESHEET_PNG, FILE_RAM_SPRITESHEET_JSON);
    this.load.aseprite('objects-spritesheet', FILE_OBJECTS_PNG, FILE_OBJECTS_JSON);
    this.load.aseprite('switch', FILE_SWITCH_IMAGE, FILE_SWITCH_SPRITE);
    this.load.aseprite('pointer', FILE_POINTER_PNG, FILE_POINTER_JSON);
    this.load.aseprite('wide-button', FILE_WIDE_BUTTON_PNG, FILE_WIDE_BUTTON_JSON);

    this.load.tilemapTiledJSON('map-level-1', FILE_LEVEL_1_MAP_JSON);

    // load UI resoucres

    this.load.image('button-green', FILE_BUTTON_GREEN);
    this.load.image('button-yellow', FILE_BUTTON_YELLOW);
    this.load.image('button-red', FILE_BUTTON_RED);
    this.load.image('button-x', FILE_BUTTON_X);
    this.load.aseprite('switch-animated', FILE_SWITCH_ANIMATED, FILE_SWITCH_ANIMATED_JSON);
    this.load.image('dialog_bg', FILE_DIALOG_BG);
    this.load.image('dialog_frame', FILE_DIALOG_FRAME);

    this.load.audio('jump', [FILE_JUMP_WAV]);
  }

  create() {
    this.anims.createFromAseprite('pointer');
    this.anims.get('Bidirectional Pointer').repeat = -1;

    // Run debug output
    // this.scene.run('DebugScene', {
    //   watch: 'GameScene'
    // });

    this.scene.run('GameScene');
    this.scene.run('ScoreboardScene');
    this.scene.run('DialogScene');
  }
}
