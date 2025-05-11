import Phaser, { Scene } from 'phaser';
import StateMachine from '../state-machine';
import * as CONST from '../const';

import {
  Direction,
  CharAttributes,
  RamAnimationKey
} from '../enums';

export enum PlayerState {
  DIE = 'DIE',
  FALL = 'FALL',
  FLY = 'JUMP_TOP',
  HURT = 'HURT',
  IDLE = 'IDLE',
  JUMP = 'JUMP_UP',
  JUMP_TOP = 'JUMP_TOP',
  LANDING = 'LANDING',
  RUN = 'RUN',
};

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
      .addState(PlayerState.RUN, { onEnter: this.handleRunEnter })
      .addState(PlayerState.JUMP, { onEnter: this.handleJumpUpEnter, onUpdate: this.handleJumpUpUpdate })
      .addState(PlayerState.JUMP_TOP, { onEnter: this.handleJumpTopEnter })
      .addState(PlayerState.FALL, { onEnter: this.handleFallEnter })
      .addState(PlayerState.LANDING, { onEnter: this.handleLandingEnter, onUpdate: this.handleLandingUpdate })
      .addState(PlayerState.HURT, { onEnter: this.handleHurtEnter, onUpdate: this.handleHurtUpdate })
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

  hurt() {
    return this.setState(PlayerState.HURT);
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

  update(time: number) {
    this.stateMachine.update(time);
  }

  private handleIdleEnter() {
    this.play(RamAnimationKey.RAM_IDLE);
  }

  private handleJumpUpEnter() {
    const velocity = this.data.get(CharAttributes.JumpSpeed) || 0;
    this.jumpTime = 0;
    this.play(RamAnimationKey.RAM_JUMP_UP);
    this.setVelocityY(velocity);
  }




  private handleJumpTopEnter() {}

  private handleRunEnter() {}

  private handleJumpUpUpdate() {}

  private handleFallEnter() {}

  private handleLandingEnter() {}

  private handleLandingUpdate() {}

  private handleHurtEnter() {}

  private handleHurtUpdate() {}

  private handleDieEnter() {}






  // private handleIdleEnter() {
  //   this.isRunningStart = false;
  //   this.setVelocityX(0);
  //   this.play(CONST.ANIMATION_KEY.RAM_IDLE);
  // }

  // private handleRunEnter() {
  //   // const DIRECTION_RIGHT = 'right';
  //   const DIRECTION_LEFT = 'left';
  //   this.isRunningStart = true;
  //   this.play('Ram Run', true);
  //   if (this.direction === Direction.Left) this.setVelocityX(-CONST.PLAYER_RUN_VELOCITY);
  //   else this.setVelocityX(CONST.PLAYER_RUN_VELOCITY);
  // }



  // private handleJumpUpUpdate(time: number) {
  //   if (!this.jumpStartTime) this.jumpStartTime = time;
  //   if (time - this.jumpStartTime <= CONST.PLAYER_JUMP_MAX_TIME) this.setVelocityY(CONST.PLAYER_JUMP_VELOCITY);
  //   else this.setState('JUMP_TOP');
  // }

  // private handleJumpTopEnter() {
  //   this.play('Ram Fly');
  // }

  // private handleFallEnter() {
  //   this.play('Ram Fall');
  // }

  // private handleLandingEnter() {
  //   this.play('Ram Landing');
  //   if (this.isRunningStart) this.playAfterRepeat('Ram Run');
  //   else this.playAfterRepeat('Ram Idle');
  // }

  // private handleLandingUpdate() {
  //   const animationName = this.anims.getName();
  //   if (animationName === 'Ram Run') this.setState('RUN');
  //   if (animationName === 'Ram Idle') this.setState('IDLE');
  // }

  // private handleDieEnter() {
  //   this.play('Ram Dizzy');
  //   this.emit('dead');
  // }
}
