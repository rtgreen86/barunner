import { Physics } from 'Phaser';

// const IDLE = 'Idle';
// const JUMP = 'Idle'; // 'ram-jump';
const FALL = 'Idle'; // 'ram-fall';
const LANDING = 'Idle'; //'ram-landing';
// const RUN = 'Idle'; // 'ram-run';
const DIE = 'Idle'; //  'ram-die';


const DASH = 'Ram Dash';
const IDLE = 'Ram Idle';
const DIZZY = 'Ram Dizzy';
const HURT = 'Ram Hurt';
const TAKEOFF_RUN = 'Ram Takeoff Run';
const JUMP = 'Ram Jump';
const RUN = 'Ram Run';
const ATTACK = 'Ram Attack';
const FAINT = 'Ram Faint';

const MAX_JUMP_TIME = 300;
const LANDING_TIME = 80;

const RUN_VELOCITY = 600;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, controller) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setSize(128, 128);
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

  dash() {
    this.setAnimation(DASH);
  }

  idle() {
    this.setVelocityX(0);
    this.setAnimation(IDLE);
  }

  dizzy() {
    this.setAnimation(DIZZY);
  }

  hurt() {
    this.setAnimation(HURT);
  }

  takeoffRun() {
    this.setAnimation(TAKEOFF_RUN);
    this.setVelocityX(-100);
  }

  jump() {
    this.setAnimation(JUMP);
    // if (!this.isJumpSoundPlayed) {
    //   this.scene.jumpSound.play();
    //   this.isJumpSoundPlayed = true;
    // }
    // this.setAnimation(JUMP);
    // if (this.animationTime <= MAX_JUMP_TIME) {
    //   this.body.setVelocityY(-250);
    // }
    // this.idle();
  }


  run(direction) {
    this.setAnimation(RUN);
    if (direction === 'backward') {
      this.setVelocityX(-RUN_VELOCITY);
      this.flipX = true;
      return;
    }
    this.setVelocityX(RUN_VELOCITY);
    this.flipX = false;
  }

  attack() {
    this.setAnimation(ATTACK);
  }

  faint() {
    this.setAnimation(FAINT);
  }


  fall() {
    // this.setAnimation(FALL);
    this.idle();
  }

  landing() {
    this.setAnimation(LANDING);
    this.isJumpSoundPlayed = false;
    this.idle();
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
      this.idle();
    }
  }

  respawn() {
    this.isDead = false;
    this.idle();
  }
}
