export enum CharAttributes {
  DizzyTime = 'DizzyTime',
  Health = 'Health',
  JumpSpeed = 'JumpSpeed',
  JumpTime = 'JumpTime',
  RunSpeed = 'RunSpeed',
};

export enum Direction {
  Right = 'Right',
  Left = 'Left',
};

export enum RamAnimationKey {
  RAM_ATTACK = 'Ram Attack',
  RAM_DASH = 'Ram Dash',
  RAM_DIZZY = 'Ram Dizzy',
  RAM_FAINT = 'Ram Faint',
  RAM_FALL = 'Ram Fall',
  RAM_FLY = 'Ram Fly',
  RAM_HURT = 'Ram Hurt',
  RAM_IDLE = 'Ram Idle',
  RAM_JUMP = 'Ram Jump',
  RAM_JUMP_UP = 'Ram Jump Up',
  RAM_LANDING = 'Ram Landing',
  RAM_RUN = 'Ram Run',
  RAM_TAKEOFF_RUN = 'Ram Takeoff Run',
};

export enum SceneKey {
  BootScene = 'BootScene',
  GameScene = 'GameScene',
  GameoverScene = 'GameOver',
  ControllerScene = 'ControllerScene'
};

export enum PlayerState {
  DIE = 'DIE',
  DIZZY = 'DIZZY',
  FALL = 'FALL',
  FLY = 'FLY',
  HURT = 'HURT',
  IDLE = 'IDLE',
  JUMP = 'JUMP_UP',
  LANDING = 'LANDING',
  RUN = 'RUN',
};
