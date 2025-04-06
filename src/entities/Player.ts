import Phaser, { Scene } from 'phaser';
import StateMachine from '../state-machine';
import * as CONST from '../const';


export default class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly jumpMaxTime = CONST.PLAYER_JUMP_MAX_TIME;
  private readonly jumpVelocity = CONST.PLAYER_JUMP_VELOCITY;
  private readonly runVelocity = CONST.PLAYER_RUN_VELOCITY;

  private isDown?: unknown;
  private isRunningStart = false;
  private jumpStartTime = 0;

  private readonly stateMachine;

  constructor(scene: Scene, x: number = 0, y: number = 0) {
    super(scene, x, y, CONST.SPRITESHEET.RAM, 0);
    this.scene.physics.world.enable(this);

    this.direction = CONST.DIRECTION.RIGHT;
    this.setSize(Player.width, Player.height);
    this.setMaxVelocity(1200, 600)
    this.setData('isAlive', true);
    this.setBounceX(0.7);
    this.play(CONST.ANIMATION_KEY.RAM_IDLE);

    this.stateMachine = new StateMachine(this, 'Player')
      .addState('IDLE', { onEnter: this.handleIdleEnter })
      .addState('RUN', { onEnter: this.handleRunEnter })
      .addState('JUMP_UP', { onEnter: this.handleJumpUpEnter, onUpdate: this.handleJumpUpUpdate })
      .addState('JUMP_TOP', { onEnter: this.handleJumpTopEnter })
      .addState('FALL', { onEnter: this.handleFallEnter })
      .addState('LANDING', { onEnter: this.handleLandingEnter, onUpdate: this.handleLandingUpdate })
      .addState('DIE', { onEnter: this.handleDieEnter });

    // this.body

    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
  }

  get animationName() {
    return this.anims.getName();
  }

  get velocityX() {
    return this.body?.velocity.x;
  }

  get velocityY() {
    return this.body?.velocity.y;
  }

  static width = 100;
  static height = 60;

  initStateMachine() {
    this.stateMachine
      .addState('IDLE', { onEnter: this.handleIdleEnter })
      .addState('RUN', { onEnter: this.handleRunEnter })
      .addState('JUMP_UP', { onEnter: this.handleJumpUpEnter, onUpdate: this.handleJumpUpUpdate })
      .addState('JUMP_TOP', { onEnter: this.handleJumpTopEnter })
      .addState('FALL', { onEnter: this.handleFallEnter })
      .addState('LANDING', { onEnter: this.handleLandingEnter, onUpdate: this.handleLandingUpdate })
      .addState('DIE', { onEnter: this.handleDieEnter });

    return this;
  }

  get currentStateName() {
    return this.stateMachine.currentState;
  }

  get isJumping() {
    return this.stateMachine.isCurrentState(CONST.STATE.JUMP);
  }

  get isRunning() {
    return this.stateMachine.isCurrentState(CONST.STATE.RUN);
  }

  get isFalling() {
    return this.stateMachine.isCurrentState(CONST.STATE.FALL);
  }

  get isLanding() {
    return this.stateMachine.isCurrentState(CONST.STATE.LANDING);
  }

  get isIdle() {
    return this.stateMachine.isCurrentState(CONST.STATE.IDLE);
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

  touch(isDown: unknown, time: unknown, delta: unknown) {
    if (this.isDown !== isDown) {
      this.isDown = isDown;
    }
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
    if (this.direction === DIRECTION_LEFT) this.setVelocityX(-this.runVelocity);
    else this.setVelocityX(this.runVelocity);
  }

  private handleJumpUpEnter() {
    this.play('Ram Jump Up');
    this.setVelocityY(this.jumpVelocity);
    this.jumpStartTime = 0;
  }

  private handleJumpUpUpdate(time: number) {
    if (!this.jumpStartTime) this.jumpStartTime = time;
    if (time - this.jumpStartTime <= this.jumpMaxTime) this.setVelocityY(this.jumpVelocity);
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
