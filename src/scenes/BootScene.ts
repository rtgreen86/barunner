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

// UI
import DIALOG_BG from '../../assets/images/ui/dialog_bg.png';
import DIALOG_FRAME from '../../assets/images/ui/dialog_frame.png';
import BUTTON_GREEN from '../../assets/images/ui/button_green.png';
import BUTTON_YELLOW from '../../assets/images/ui/button_yellow.png';
import BUTTON_RED from '../../assets/images/ui/button_red.png';
import BUTTON_X from '../../assets/images/ui/button_x.png';
import SWITCH_ANIMATED from '../../assets/images/ui/switch_animated.png';
import SWITCH_ANIMATED_JSON from '../../assets/images/ui/switch_animated.json';

// Hill

import HILL_LAYER_1_PNG from '../../assets/images/hill/hill-layer-1.png';
import HILL_LAYER_2_PNG from '../../assets/images/hill/hill-layer-2.png';
import HILL_LAYER_3_PNG from '../../assets/images/hill/hill-layer-3.png';
import HILL_LAYER_4_PNG from '../../assets/images/hill/hill-layer-4.png';


import { TextureKeys, SpritesheetKeys, AnimationKeys } from '../const';
import * as CONST from '../const';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: CONST.SCENE_KEYS.BOOT_SCENE, active: true });
  }

  preload() {
    this.load.image('background-layer-1', FILE_BACKGROUND_LAYER_1_PNG);
    this.load.image('background-layer-2', FILE_BACKGROUND_LAYER_2_PNG);
    this.load.image('level-1-tileset', FILE_LEVEL_1_TILESET_PNG);
    this.load.image('modal-dialog', FILE_MODAL_DIALOG);
    this.load.tilemapTiledJSON('map-level-1', FILE_LEVEL_1_MAP_JSON);

    this.loadUI();
    this.loadAudio();


    this.load.image(TextureKeys.HillLayer1, HILL_LAYER_1_PNG);
    this.load.image(TextureKeys.HillLayer2, HILL_LAYER_2_PNG);
    this.load.image(TextureKeys.HillLayer3, HILL_LAYER_3_PNG);
    this.load.image(TextureKeys.HillLayer4, HILL_LAYER_4_PNG);

    this.loadSprites();
  }

  loadUI() {
    this.load.image('dialog_bg', DIALOG_BG);
    this.load.image('dialog_frame', DIALOG_FRAME);
    this.load.image('button-green', BUTTON_GREEN);
    this.load.image('button-yellow', BUTTON_YELLOW);
    this.load.image('button-red', BUTTON_RED);
    this.load.image('button-x', BUTTON_X);
    this.load.aseprite('switch-animated', SWITCH_ANIMATED, SWITCH_ANIMATED_JSON);
  }

  loadAudio() {
    this.load.audio('jump', [FILE_JUMP_WAV]);
  }

  create() {
    this.createAnimation();
    this.scene.run(CONST.SCENE_KEYS.GAME_SCENE);
  }

  createAnimation() {
    this.anims.createFromAseprite('switch-animated');
    this.anims.get('Indicate').repeat = -1;

    // new RAM

    this.anims.createFromAseprite(SpritesheetKeys.RamSpritesheet);
    this.anims.get(AnimationKeys.RAM_DASH).repeat = -1;
    this.anims.get(AnimationKeys.RAM_IDLE).repeat = -1;
    this.anims.get(AnimationKeys.RAM_DIZZY).repeat = -1;
    this.anims.get(AnimationKeys.RAM_HURT).repeat = -1;
    this.anims.get(AnimationKeys.RAM_TAKEOFF_RUN).repeat = -1;
    this.anims.get(AnimationKeys.RAM_JUMP_UP).repeat = 0;
    this.anims.get(AnimationKeys.RAM_FALL).repeat = 0;
    this.anims.get(AnimationKeys.RAM_RUN).repeat = -1;
  }

  loadSprites() {
    this.load.aseprite(SpritesheetKeys.RamSpritesheet, FILE_RAM_SPRITESHEET_PNG, FILE_RAM_SPRITESHEET_JSON);
    this.load.aseprite('objects-spritesheet', FILE_OBJECTS_PNG, FILE_OBJECTS_JSON);
  }
}