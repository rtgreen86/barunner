import { Physics } from 'Phaser';

const IDLE = 'ram-idle';
const JUMP = 'ram-jump';
const FALL = 'ram-fall';
const LANDING = 'ram-landing';
const RUN = 'ram-run';
const DIE = 'ram-die';

const MAX_JUMP_TIME = 300;
const LANDING_TIME = 80;

const RUN_VELOCITY = 600;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, controller) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setSize(45, 30);
    this.time = 0;

    this.isDead = false;

    this.animation = IDLE;
    this.animationTime = 0;
    this.animationStartTime = null;

    this.controller = controller;
    this.jumpKeyPressed = false;
    this.jumpKeyPressedTime = null;
    this.gameStartedTime = null;

    this.isJumpSoundPlayed = false;
  }

  setAnimation(animation) {
    if (this.animation === animation) {
      return;
    }
    this.animation = animation;
    this.animationTime = 0;
    this.animationStartTime = this.time;
    this.play(this.animation, true);
  }

  run() {
    this.setAnimation(RUN);
    this.setVelocityX(RUN_VELOCITY);
  }

  jump() {
    if (!this.isJumpSoundPlayed) {
      this.scene.jumpSound.play();
      this.isJumpSoundPlayed = true;
    }
    this.setAnimation(JUMP);
    if (this.animationTime <= MAX_JUMP_TIME) {
      this.body.setVelocityY(-250);
    }
  }

  fall() {
    this.setAnimation(FALL);
  }

  landing() {
    this.setAnimation(LANDING);
    this.isJumpSoundPlayed = false;
  }

  idle() {
    this.setVelocityX(0);
    this.setAnimation(IDLE);
  }

  die() {
    this.isDead = true;
    this.isJumpSoundPlayed = false;
    this.setVelocity(0, 0);
    this.setAnimation(DIE);
  }

  isMoving() {
    return this.body.velocity.x !== 0;
  }

  isFalling() {
    return this.body.velocity.y > 10;
  }

  onJumpPressed() {
    // continue jump
    if (this.animation === JUMP && this.jumpKeyPressedTime === this.animationStartTime) {
      this.jump();
      return;
    }

    // start jump
    // ram on the ground, run and button just pressed
    if (
      this.animation === RUN &&
      (this.jumpKeyPressedTime === null || this.time - this.jumpKeyPressedTime < 200) &&
      this.jumpKeyPressedTime !== this.gameStartedTime
    ) {
      this.jump();
      this.jumpKeyPressedTime = this.time;
    }

    if (this.jumpKeyPressedTime === null) {
      this.jumpKeyPressedTime = this.time;
    }

    // start game
    if (!this.isMoving()) {
      this.run();
      this.gameStartedTime = this.time;
    }
  }

  onJumpReleased() {
    this.jumpKeyPressedTime = null;
  }

  update(time, delta) {
    if (this.isDead) {
      return;
    }

    this.animationTime += delta;
    this.time = time;

    // process user input
    if (this.controller.isJumpDown) {
      this.onJumpPressed();
    }
    if (this.jumpKeyPressedTime !== null && !this.controller.isJumpDown) {
      this.onJumpReleased();
    }

    // falling and landing
    if (this.isFalling()) {
      this.fall();
    }
    if (this.animation === FALL && !this.isFalling()) {
      this.landing();
    }
    if (this.animation === LANDING && this.animationTime > LANDING_TIME) {
      this.run();
    }
  }

  respawn() {
    this.isDead = false;
    this.idle();
  }
}
