import Phaser, { Scene } from 'phaser';
import StateMachine from '../lib/state-machine';
import * as CONST from '../const';
import { Direction, CharAttributes, RamAnimationKey, PlayerState } from '../enums';


export default class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpTime = 0;

  private readonly stateMachine;


  constructor(scene: Scene, x: number = 0, y: number = 0) {
    super(scene, x, y, CONST.SPRITESHEET.RAM, 0);

    this.scene.physics.world.enable(this);
    this.arcadeBody?.setCollideWorldBounds(true);
    this.direction = Direction.Right;
    this.setSize(CONST.PLAYER_WIDTH, CONST.PLAYER_HEIGHT);
    this.setMaxVelocity(CONST.PLAYER_RUN_VELOCITY, CONST.PLAYER_MAX_VERTICAL_VELOCITY)
    this.setData('isAlive', true);
    this.setBounceX(CONST.PLAYER_BOUNCE_X);

    this.stateMachine = new StateMachine(this, 'Player')
      .addState(PlayerState.IDLE, { onEnter: this.handleIdleEnter })
      .addState(PlayerState.RUN, { onEnter: this.handleRunEnter, onUpdate: this.handleRunUpdate })
      .addState(PlayerState.JUMP, { onEnter: this.handleJumpUpEnter, onUpdate: this.handleJumpUpUpdate })
      .addState(PlayerState.FLY, { onEnter: this.handleFlyEnter, onUpdate: this.handleFlyUpdate })
      .addState(PlayerState.FALL, { onEnter: this.handleFallEnter })
      .addState(PlayerState.LANDING, { onEnter: this.handleLandingEnter, onUpdate: this.handleLandingUpdate })
      .addState(PlayerState.HURT)
      .addState(PlayerState.DIE, { onEnter: this.handleDieEnter });
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
    return this.flipX ? Direction.Left : Direction.Right;
  }

  set direction(value) {
    this.flipX = value === Direction.Left;
  }

  get isMoving() {
    return this.body?.velocity.x !== 0;
  }


  isCurrentState(state: PlayerState) {
    return this.state === state;
  }

  setState(state: PlayerState) {
    this.stateMachine.setState(state);
    return this;
  }

  idle() {
    return this.setState(PlayerState.IDLE);
  }

  run(direction = Direction.Right) {
    this.direction = direction;
    return this.setState(PlayerState.RUN);
  }

  jump() {
    return this.setState(PlayerState.JUMP);
  }

  fly() {
    return this.setState(PlayerState.FLY);
  }

  die() {
    return this.setState(PlayerState.DIE);
  }

  fall() {
    return this.setState(PlayerState.FALL);
  }

  landing() {
    return this.setState(PlayerState.LANDING);
  }

  respawn() {
    this.idle();
  }

  update(time: number, delta: number) {
    this.stateMachine.update(time, delta);
  }

  private handleIdleEnter() {
    this.play(RamAnimationKey.RAM_IDLE);
    this.setVelocityX(0);
  }

  private handleJumpUpEnter() {
    this.jumpTime = 0;
    this.play(RamAnimationKey.RAM_JUMP_UP);
  }

  private handleJumpUpUpdate(time: number, delta: number) {
    const maxTime = this.data.get(CharAttributes.JumpTime) || 0;
    this.jumpTime += delta;
    if (this.jumpTime < maxTime) {
      const velocity = this.data.get(CharAttributes.JumpSpeed) || 0;
      this.setVelocityY(velocity);
    }
  }

  private handleFlyEnter() {
    this.play(RamAnimationKey.RAM_FLY);
  }

  private handleFlyUpdate() {
    if (this.velocityY >= 0) this.fall();
  }

  private handleFallEnter() {
    this.play(RamAnimationKey.RAM_FLY);
    this.playAfterDelay(RamAnimationKey.RAM_FALL, 500);
  }

  private handleLandingEnter() {
    this.play(RamAnimationKey.RAM_LANDING);
  }

  private handleLandingUpdate() {
    this.idle();
  }

  private handleRunEnter() {
    this.play(RamAnimationKey.RAM_RUN);
  }

  private handleRunUpdate() {
    const speed = this.data.get(CharAttributes.RunSpeed);
    this.setVelocityX(this.direction === Direction.Right
      ? speed
      : -speed
    );
  }

  private handleDieEnter() {
    this.setVelocityX(0);
    this.play(RamAnimationKey.RAM_FAINT);
  }
}
