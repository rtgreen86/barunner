import Phaser from 'phaser';

import { TextureKey, SpritesheetKey, RamAnimationKey, ObjectsAnimationKey, SceneKey } from '../resources';

import FILE_LEVEL_1_MAP_JSON from '../../assets/map/level-1-map.json';
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

// new obstacles

import OBSTACLES_EFFECT_PNG from '../../assets/images/obstacle-effect.png';
import OBSTACLES_EFFECT_JSON from '../../assets/images/obstacle-effect.json';

const baseURL = import.meta.env.VITE_ASSETS_BASE_URL;

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.BootScene, active: true });
  }

  preload() {
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

    // Sprites and objects
    this.load.aseprite('obstacles-effects', OBSTACLES_EFFECT_PNG, OBSTACLES_EFFECT_JSON);


    // Hills background
    this.load.image(TextureKey.HillLayer1, `${baseURL}/images/hill-layer-1.png`);
    this.load.image(TextureKey.HillLayer2, `${baseURL}/images/hill-layer-2.png`);
    this.load.image(TextureKey.HillLayer3, `${baseURL}/images/hill-layer-3.png`);
    this.load.image(TextureKey.HillLayer4, `${baseURL}/images/hill-layer-4.png`);
    this.load.image(TextureKey.HillLayer5, `${baseURL}/images/hill-layer-5.png`);

    // Spritesheets
    this.load.aseprite(SpritesheetKey.RamSpritesheet, `${baseURL}/spritesheets/ram-spritesheet.png`, `${baseURL}/spritesheets/ram-spritesheet.json`);
    this.load.aseprite(SpritesheetKey.Objects, `${baseURL}/spritesheets/objects.png`, `${baseURL}/spritesheets/objects.json`);
  }

  create() {
    // UI Animation
    this.anims.createFromAseprite('switch-animated');
    this.anims.get('Indicate').repeat = -1;

    // Ram animation
    this.anims.createFromAseprite(SpritesheetKey.RamSpritesheet);
    this.anims.get(RamAnimationKey.RAM_DASH).repeat = -1;
    this.anims.get(RamAnimationKey.RAM_IDLE).repeat = -1;
    this.anims.get(RamAnimationKey.RAM_DIZZY).repeat = -1;
    this.anims.get(RamAnimationKey.RAM_HURT).repeat = -1;
    this.anims.get(RamAnimationKey.RAM_TAKEOFF_RUN).repeat = -1;
    this.anims.get(RamAnimationKey.RAM_JUMP_UP).repeat = 0;
    this.anims.get(RamAnimationKey.RAM_FALL).repeat = 0;
    this.anims.get(RamAnimationKey.RAM_RUN).repeat = -1;

    // Effects
    this.anims.createFromAseprite(SpritesheetKey.Objects);
    this.anims.get(ObjectsAnimationKey.BOX).repeat = -1;

    // Run scene
    this.scene.run(SceneKey.GameScene);
  }
}
