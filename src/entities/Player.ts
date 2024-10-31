import Phaser, { Physics, Scene } from 'phaser';
import StateMachine from '../state-machine';
import * as States from '../states';

const ANIMATION_IDLE = 'Ram Idle';
const ANIMATION_JUMP_UP = 'Ram Jump Up';
const ANIMATION_FLY = 'Ram Fly';
const ANIMATION_FALL = 'Ram Fall';
const ANIMATION_LANDING = 'Ram Landing';
const ANIMATION_DASH = 'Ram Dash';
const ANIMATION_DIZZY = 'Ram Dizzy';
const ANIMATION_HURT = 'Ram Hurt';
const ANIMATION_TAKEOFF_RUN = 'Ram Takeoff Run';
const ANIMATION_RUN = 'Ram Run';
const ANIMATION_ATTACK = 'Ram Attack';
const ANIMATION_FAINT = 'Ram Faint';

const DIRECTION_RIGHT = 'right';
const DIRECTION_LEFT = 'left';


const IDLE = 'IDLE';
const RUN = 'RUN';
const JUMP = 'JUMP_UP';
const FLY = 'JUMP_TOP';
const FALL = 'FALL';
const LANDING = 'LANDING';

export default class Player extends Physics.Arcade.Sprite {
  private runVelocity = 1200;
  private jumpVelocity = -500;
  private jumpMaxTime = 300;
  private isJumpSoundPlayed?: boolean;
  private isDown?: unknown;

  private jumpStartTime = 0;
  private jumpCurrentTime = 0;

  private stateParams = {
    isRunningStart: false,
    direction: 'right' as "right" | "left",
    runVelocity: this.runVelocity,
    jumpVelocity: this.jumpVelocity,
    jumpMaxTime: this.jumpMaxTime
  };

  readonly stateMachine = new StateMachine(this, 'Player');

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: Phaser.Textures.Texture,
    frame: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.scene.physics.world.enable(this);
    this.direction = DIRECTION_RIGHT;
    this.initStateMachine();
    this.setSize(Player.width, Player.height);
    this.setMaxVelocity(1200, 600)
    this.setData('isAlive', true);
    this.setBounceX(0.7);
    this.play(ANIMATION_IDLE);
  }

  get animationName() {
    return this.anims.getName();
  }

  get stateName() {
    return this.stateMachine.currentStateName.toString();
  }

  get velocityX() {
    return this.body.velocity.x;
  }

  get velocityY() {
    return this.body.velocity.y;
  }

  static width = 128;
  static height = 64;

  initStateMachine() {
    this.stateMachine
      .addState(new States.Idle(this, this.stateParams))
      .addState(new States.Run(this, this.stateParams))
      .addState(new States.JumpUp(this, this.stateParams))
      .addState(new States.JumpTop(this))
      .addState(new States.Fall(this))
      .addState(new States.Landing(this, this.stateParams));

    return this;
  }

  get isJumping() {
    return this.stateMachine.isCurrentState(JUMP);
  }

  get isRunning() {
    return this.stateMachine.isCurrentState(RUN);
  }

  get isFalling() {
    return this.stateMachine.isCurrentState(FALL);
  }

  get isLanding() {
    return this.stateMachine.isCurrentState(LANDING);
  }

  get isIdle() {
    return this.stateMachine.isCurrentState(IDLE);
  }

  get direction() {
    return this.flipX ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }

  set direction(value) {
    this.flipX = value === DIRECTION_LEFT;
  }

  isCurrentState(stateName: string) {
    return this.stateMachine.isCurrentState(stateName);
  }

  jump(duration: number) {
    const animName = this.anims.getName();
    if (animName === ANIMATION_IDLE || animName === ANIMATION_RUN) {
      this.jumpStartTime = duration;
      this.stateMachine.setState(JUMP);
    }
    this.jumpCurrentTime = duration;
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
    this.stateMachine.setState(FLY);
    return this;
  }

  fall() {
    this.stateMachine.setState(FALL);
    return this;
  }

  landing() {
    this.stateMachine.setState(LANDING);
    return this;
  }

  idle() {
    this.stateMachine.setState(IDLE);
    return this;
  }

  run() {
    this.stateMachine.setState(RUN);
    return this;
  }

  setState(state: string) {
    this.stateMachine.setState(state);
    return this;
  }

  hurt() {
    this.stateParams.isRunningStart = false;
    return this.play(ANIMATION_HURT);
  }

  dash() {
    this.stateParams.isRunningStart = false;
    return this.play(ANIMATION_DASH);
  }

  takeoffRun() {
    this.play(ANIMATION_TAKEOFF_RUN);
    this.setVelocityX(-100);
  }

  dizzy() {
    this.play(ANIMATION_DIZZY);
  }

  attack() {
    this.play(ANIMATION_ATTACK);
  }

  faint() {
    this.play(ANIMATION_FAINT);
  }

  die() {
    this.isJumpSoundPlayed = false;
    this.setVelocity(0, 0);
    this.play('Idle');
  }

  isMoving() {
    return this.body.velocity.x !== 0;
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
  }

  private handleJumpEnter() {
    this.play(ANIMATION_JUMP_UP);
    this.setVelocityY(this.jumpVelocity);
  }

  private handleJumpUpdate() {
    const animName = this.anims.getName();
    if (animName === ANIMATION_JUMP_UP && this.jumpCurrentTime - this.jumpStartTime <= this.jumpMaxTime) {
      this.setVelocityY(this.jumpVelocity);
    }
  }

  private handleFlyEnter() {
    this.play(ANIMATION_FLY);
  }

  private handleFallEnter() {
    this.play(ANIMATION_FALL);
  }

  private handleLandingEnter() {
    if (this.stateParams.isRunningStart) {
      this.play(ANIMATION_LANDING);
      this.playAfterRepeat(ANIMATION_RUN);
      return;
    }
    this.stateMachine.setState(IDLE);
  }

  private handleLandingUpdate() {
    const animName = this.anims.getName();
    if (animName === ANIMATION_RUN) {
      this.stateMachine.setState(RUN);
    }
  }

  private handleIdleEnter() {
    this.stateParams.isRunningStart = false;
    this.setVelocityX(0);
    this.play(ANIMATION_IDLE);
  }

  private handleRunEnter() {
    this.stateParams.isRunningStart = true;
    this.play(ANIMATION_RUN, true);
    this.setVelocityX(
      this.direction === DIRECTION_LEFT
        ? -this.runVelocity
        : this.runVelocity
    );
  }
}
