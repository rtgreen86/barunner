import Phaser from 'phaser';

import { SceneKeys, TextureKeys, SpritesheetKeys, AnimationKeys } from '../const';

import FILE_BACKGROUND_LAYER_1_PNG from '../../assets/images/background-layer-1.png'
import FILE_BACKGROUND_LAYER_2_PNG from '../../assets/images/background-layer-2.png'
import FILE_LEVEL_1_MAP_JSON from '../../assets/map/level-1-map.json';
import FILE_LEVEL_1_TILESET_PNG from '../../assets/images/level-1-tileset.png';
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

// import HILL_LAYER_1_PNG from '../../assets/images/hill/hill-layer-1.png';
// import HILL_LAYER_2_PNG from '../../assets/images/hill/hill-layer-2.png';
// import HILL_LAYER_3_PNG from '../../assets/images/hill/hill-layer-3.png';
// import HILL_LAYER_4_PNG from '../../assets/images/hill/hill-layer-4.png';
// import HILL_TREE_PNG from '../../assets/images/hill/hill-tree.png';

// new obstacles

import OBSTACLES_PNG from '../../assets/images/obstacles.png';
import OBSTACLES_EFFECT_PNG from '../../assets/images/obstacle-effect.png';
import OBSTACLES_EFFECT_JSON from '../../assets/images/obstacle-effect.json';
import FILE_OBJECTS_JSON from '../../assets/images/objects.json';
import FILE_OBJECTS_PNG from '../../assets/images/objects.png';

const baseURL = import.meta.env.VITE_ASSETS_BASE_URL;

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.BootScene, active: true });
  }

  preload() {
    // Old backgrounds
    // TODO: remove old backgrounds
    this.load.image('background-layer-1', FILE_BACKGROUND_LAYER_1_PNG);
    this.load.image('background-layer-2', FILE_BACKGROUND_LAYER_2_PNG);
    this.load.image('level-1-tileset', FILE_LEVEL_1_TILESET_PNG);

    // Old Map
    // TODO: Remove old map loading
    this.load.tilemapTiledJSON('map-level-1', FILE_LEVEL_1_MAP_JSON);

    // UI
    this.load.image('modal-dialog', FILE_MODAL_DIALOG);
    this.load.image('dialog_bg', DIALOG_BG);
    this.load.image('dialog_frame', DIALOG_FRAME);
    this.load.image('button-green', BUTTON_GREEN);
    this.load.image('button-yellow', BUTTON_YELLOW);
    this.load.image('button-red', BUTTON_RED);
    this.load.image('button-x', BUTTON_X);
    this.load.aseprite('switch-animated', SWITCH_ANIMATED, SWITCH_ANIMATED_JSON);

    // Audio
    this.load.audio('jump', [FILE_JUMP_WAV]);

    console.log('BASE is: ', import.meta.env.VITE_ASSETS_BASE_URL)
    console.log('PATH is: ', `${baseURL}/images/hill-layer-1.png`);

    // Hills backgrounds
    this.load.image(TextureKeys.HillLayer1, `${baseURL}/images/hill-layer-1.png`);
    this.load.image(TextureKeys.HillLayer2, `${baseURL}/images/hill-layer-2.png`);
    this.load.image(TextureKeys.HillLayer3, `${baseURL}/images/hill-layer-3.png`);
    this.load.image(TextureKeys.HillLayer4, `${baseURL}/images/hill-layer-4.png`);
    this.load.image(TextureKeys.HillTree, `${baseURL}/sprites/hill-tree.png`);

    // Sprites and objects
    this.load.aseprite(SpritesheetKeys.RamSpritesheet, FILE_RAM_SPRITESHEET_PNG, FILE_RAM_SPRITESHEET_JSON);
    this.load.aseprite(SpritesheetKeys.Objects, FILE_OBJECTS_PNG, FILE_OBJECTS_JSON);
    this.load.aseprite(SpritesheetKeys.ObstaclesEffects, OBSTACLES_EFFECT_PNG, OBSTACLES_EFFECT_JSON);
    this.load.image(TextureKeys.Obstacles, OBSTACLES_PNG);
  }

  create() {
    // UI Animation
    this.anims.createFromAseprite('switch-animated');
    this.anims.get('Indicate').repeat = -1;

    // Ram animation
    this.anims.createFromAseprite(SpritesheetKeys.RamSpritesheet);
    this.anims.get(AnimationKeys.RAM_DASH).repeat = -1;
    this.anims.get(AnimationKeys.RAM_IDLE).repeat = -1;
    this.anims.get(AnimationKeys.RAM_DIZZY).repeat = -1;
    this.anims.get(AnimationKeys.RAM_HURT).repeat = -1;
    this.anims.get(AnimationKeys.RAM_TAKEOFF_RUN).repeat = -1;
    this.anims.get(AnimationKeys.RAM_JUMP_UP).repeat = 0;
    this.anims.get(AnimationKeys.RAM_FALL).repeat = 0;
    this.anims.get(AnimationKeys.RAM_RUN).repeat = -1;

    // Effects
    this.anims.createFromAseprite(SpritesheetKeys.ObstaclesEffects)
    this.anims.get(AnimationKeys.OBSTACLE_EFFECT).repeat = -1;

    // Run scene
    this.scene.run(SceneKeys.GameScene);
  }
}
