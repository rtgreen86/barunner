import { Physics } from 'Phaser';

const IDLE = 'ram-idle';
const JUMP = 'ram-jump';
const FALL = 'ram-fall';
const LANDING = 'ram-landing';
const RUN = 'ram-run';

const MAX_JUMP_TIME = 300;
const LANDING_TIME = 80;

const RUN_VELOCITY = 600;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, cursor) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setSize(45, 30);

    this.animation = IDLE;
    this.animationTime = 0;

    this.cursor = cursor;
    this.jumpKeyPressed = false;
  }

  setAnimation(animation) {
    if (this.animation === animation) {
      return;
    }
    this.animation = animation;
    this.animationTime = 0;
    this.play(this.animation, true);
  }

  run() {
    this.setAnimation(RUN);
    this.setVelocityX(RUN_VELOCITY);
  }

  jump() {
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
  }

  isMoving() {
    return this.body.velocity.x !== 0;
  }

  isFalling() {
    return this.body.velocity.y > 10;
  }

  onJumpPressed() {
    if (
      this.jumpKeyPressed && this.animation === JUMP || // continue jump
      !this.jumpKeyPressed && this.animation === RUN && this.isMoving() // start jump
    ) {
      this.jump();
    }
    if (!this.isMoving()) { // start game
      this.run();
    }
    this.jumpKeyPressed = true;
  }

  onJumpReleased() {
    this.jumpKeyPressed = false;
  }

  update(time, delta) {
    this.animationTime += delta;

    // process user input
    if (this.cursor.space.isDown) {
      this.onJumpPressed();
    }
    if (this.jumpKeyPressed && !this.cursor.space.isDown) {
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

    // if (this.animation === RUN) this.play(RUN, true);
    // if (this.animation === JUMP) this.play(JUMP, true);

    // play animation
    // this.play(this.animation, true);
  }
}
