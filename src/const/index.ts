export * as SCENE_KEYS from './SceneKeys';
export * as VIEWPORT from './Viewport';
export * as WORLD from './World';

export const CAMERA_ZOOM = 1;
export const CAMERA_PLAYER_POSITION_X = -320;
export const CAMERA_PLAYER_POSITION_Y = 280;

export enum SpritesheetKeys {
  RamSpritesheet = 'ram-spritesheet',
}

export enum AnimationKeys {
  RAM_IDLE = 'Ram Idle',
  RAM_JUMP_UP = 'Ram Jump Up',
  RAM_FLY = 'Ram Fly',
  RAM_FALL = 'Ram Fall',
  RAM_LANDING = 'Ram Landing',
  RAM_DASH = 'Ram Dash',
  RAM_DIZZY = 'Ram Dizzy',
  RAM_HURT = 'Ram Hurt',
  RAM_TAKEOFF_RUN = 'Ram Takeoff Run',
  RAM_RUN = 'Ram Run',
  RAM_ATTACK = 'Ram Attack',
  RAM_FAINT = 'Ram Faint',
}

export enum TextureKeys {
  HillLayer1 = 'hill-layer-1',
  HillLayer2 = 'hill-layer-2',
  HillLayer3 = 'hill-layer-3',
  HillLayer4 = 'hill-layer-4',
  HillTree = 'hill-tree'
}
