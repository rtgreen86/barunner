import Phaser, { Scene } from 'phaser';
import StateMachine from '../state-machine';
import * as CONST from '../const';

// TODO: delete CONST.STATE.*
// TODO: delete CONST.DIRECTION

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private isRunningStart = false; // TODO: move to state machine
  private jumpStartTime = 0; // TODO: move to state machine

  private readonly stateMachine;

  static readonly STATE_DIE = 'DIE';
  static readonly STATE_FALL = 'FALL';
  static readonly STATE_FLY = 'JUMP_TOP';
  static readonly STATE_IDLE = 'IDLE';
  static readonly STATE_JUMP = 'JUMP_UP';
  static readonly STATE_JUMP_TOP = 'JUMP_TOP';
  static readonly STATE_LANDING = 'LANDING';
  static readonly STATE_RUN = 'RUN';

  constructor(scene: Scene, x: number = 0, y: number = 0) {
    super(scene, x, y, CONST.SPRITESHEET.RAM, 0);

    this.scene.physics.world.enable(this);
    this.arcadeBody?.setCollideWorldBounds(true);

    this.direction = CONST.DIRECTION.RIGHT;

    this.setSize(CONST.PLAYER_WIDTH, CONST.PLAYER_HEIGHT);
    this.setMaxVelocity(CONST.PLAYER_RUN_VELOCITY, CONST.PLAYER_MAX_VERTICAL_VELOCITY)
    this.setData('isAlive', true);
    this.setBounceX(CONST.PLAYER_BOUNCE_X);
    this.play(CONST.ANIMATION_KEY.RAM_IDLE);

    this.stateMachine = new StateMachine(this, 'Player')
      .addState(Player.STATE_IDLE, { onEnter: this.handleIdleEnter })
      .addState(Player.STATE_RUN, { onEnter: this.handleRunEnter })
      .addState(Player.STATE_JUMP, { onEnter: this.handleJumpUpEnter, onUpdate: this.handleJumpUpUpdate })
      .addState(Player.STATE_JUMP_TOP, { onEnter: this.handleJumpTopEnter })
      .addState(Player.STATE_FALL, { onEnter: this.handleFallEnter })
      .addState(Player.STATE_LANDING, { onEnter: this.handleLandingEnter, onUpdate: this.handleLandingUpdate })
      .addState(Player.STATE_DIE, { onEnter: this.handleDieEnter });
  }

  get arcadeBody() {
    return this.body as Phaser.Physics.Arcade.Body | null;
  }

  get velocityX() {
    return this.body?.velocity.x || 0;
  }

  get velocityY() {
    return this.body?.velocity.y || 0;
  }







  get direction() {
    return this.flipX ? CONST.DIRECTION.LEFT : CONST.DIRECTION.RIGHT;
  }

  set direction(value) {
    this.flipX = value === CONST.DIRECTION.LEFT;
  }





  isCurrentState(stateName: string) {
    return this.stateMachine.isCurrentState(stateName);
  }

  jump(duration: number) {
    const animName = this.anims.getName();
    if (animName === CONST.ANIMATION_KEY.RAM_IDLE || animName === CONST.ANIMATION_KEY.RAM_RUN) {
      this.jumpStartTime = duration;
      this.stateMachine.setState(CONST.STATE.JUMP);
    }
    return this;
  }

  playAnimation(animationName: string, repeat?: boolean) {
    this.play(animationName, repeat);
    return this;
  }

  playAnimationAfterRepeat(animationName: string) {
    this.playAfterRepeat(animationName);
    return this;
  }

  fly() {
    this.stateMachine.setState(CONST.STATE.FLY);
    return this;
  }

  fall() {
    this.stateMachine.setState(CONST.STATE.FALL);
    return this;
  }

  landing() {
    this.stateMachine.setState(CONST.STATE.LANDING);
    return this;
  }

  idle() {
    this.stateMachine.setState(CONST.STATE.IDLE);
    return this;
  }

  run() {
    this.stateMachine.setState(CONST.STATE.RUN);
    return this;
  }

  setState(state: string) {
    this.stateMachine.setState(state);
    return this;
  }

  hurt() {
    this.isRunningStart = false;
    return this.play(CONST.ANIMATION_KEY.RAM_HURT);
  }

  dash() {
    this.isRunningStart = false;
    return this.play(CONST.ANIMATION_KEY.RAM_DASH);
  }

  takeoffRun() {
    this.play(CONST.ANIMATION_KEY.RAM_TAKEOFF_RUN);
    this.setVelocityX(-100);
  }

  dizzy() {
    this.play(CONST.ANIMATION_KEY.RAM_DIZZY);
  }

  attack() {
    this.play(CONST.ANIMATION_KEY.RAM_ATTACK);
  }

  faint() {
    this.play(CONST.ANIMATION_KEY.RAM_FAINT);
  }

  die() {
    this.setState('DIE');
    return this;
  }

  isMoving() {
    return this.body?.velocity.x !== 0;
  }

  respawn() {
    this.idle();
  }

  update(time: number) {
    this.stateMachine.update(time);

    if (this.stateMachine.currentState === 'DIE') {
      const velocityX = this.velocityX!;
      this.setVelocityX(velocityX * 0.99);
    }
  }

  private handleIdleEnter() {
    this.isRunningStart = false;
    this.setVelocityX(0);
    this.play(CONST.ANIMATION_KEY.RAM_IDLE);
  }

  private handleRunEnter() {
    // const DIRECTION_RIGHT = 'right';
    const DIRECTION_LEFT = 'left';
    this.isRunningStart = true;
    this.play('Ram Run', true);
    if (this.direction === DIRECTION_LEFT) this.setVelocityX(-CONST.PLAYER_RUN_VELOCITY);
    else this.setVelocityX(CONST.PLAYER_RUN_VELOCITY);
  }

  private handleJumpUpEnter() {
    this.play('Ram Jump Up');
    this.setVelocityY(CONST.PLAYER_JUMP_VELOCITY);
    this.jumpStartTime = 0;
  }

  private handleJumpUpUpdate(time: number) {
    if (!this.jumpStartTime) this.jumpStartTime = time;
    if (time - this.jumpStartTime <= CONST.PLAYER_JUMP_MAX_TIME) this.setVelocityY(CONST.PLAYER_JUMP_VELOCITY);
    else this.setState('JUMP_TOP');
  }

  private handleJumpTopEnter() {
    this.play('Ram Fly');
  }

  private handleFallEnter() {
    this.play('Ram Fall');
  }

  private handleLandingEnter() {
    this.play('Ram Landing');
    if (this.isRunningStart) this.playAfterRepeat('Ram Run');
    else this.playAfterRepeat('Ram Idle');
  }

  private handleLandingUpdate() {
    const animationName = this.anims.getName();
    if (animationName === 'Ram Run') this.setState('RUN');
    if (animationName === 'Ram Idle') this.setState('IDLE');
  }

  private handleDieEnter() {
    this.play('Ram Dizzy');
    this.emit('dead');
  }
}
