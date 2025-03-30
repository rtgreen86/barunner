import Phaser, { Scene } from 'phaser';
import StateMachine from '../state-machine';
import * as CONST from '../const';

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

export default class Player extends Phaser.Physics.Arcade.Sprite {
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

  constructor(scene: Scene, x: number = 0, y: number = 0) {
    super(scene, x, y, CONST.SPRITESHEET_RAM, 0);
    this.scene.physics.world.enable(this);
    this.direction = DIRECTION_RIGHT;
    this.initStateMachine();
    this.setSize(Player.width, Player.height);
    this.setMaxVelocity(1200, 600)
    this.setData('isAlive', true);
    this.setBounceX(0.7);
    this.play(ANIMATION_IDLE);

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
    this.stateParams.isRunningStart = false;
    this.setVelocityX(0);
    this.play(ANIMATION_IDLE);
  }

  private handleRunEnter() {
    // const DIRECTION_RIGHT = 'right';
    const DIRECTION_LEFT = 'left';
    this.stateParams.isRunningStart = true;
    this.play('Ram Run', true);
    if (this.stateParams.direction === DIRECTION_LEFT) this.setVelocityX(-this.stateParams.runVelocity);
    else this.setVelocityX(this.stateParams.runVelocity);
  }

  private handleJumpUpEnter() {
    this.play('Ram Jump Up');
    this.setVelocityY(this.stateParams.jumpVelocity);
    this.jumpStartTime = 0;
  }

  private handleJumpUpUpdate(time: number) {
    if (!this.jumpStartTime) this.jumpStartTime = time;
    if (time - this.jumpStartTime <= this.stateParams.jumpMaxTime) this.setVelocityY(this.stateParams.jumpVelocity);
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
    if (this.stateParams.isRunningStart) this.playAfterRepeat('Ram Run');
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
