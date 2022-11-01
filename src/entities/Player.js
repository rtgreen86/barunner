import { Physics } from 'Phaser';

// const IDLE = 'Idle';
// const JUMP = 'Idle'; // 'ram-jump';
const FALL = 'Idle'; // 'ram-fall';
const LANDING = 'Idle'; //'ram-landing';
// const RUN = 'Idle'; // 'ram-run';
const DIE = 'Idle'; //  'ram-die';

const ANIMATION_DASH = 'Ram Dash';
const ANIMATION_IDLE = 'Ram Idle';
const ANIMATION_DIZZY = 'Ram Dizzy';
const ANIMATION_HURT = 'Ram Hurt';
const ANIMATION_TAKEOFF_RUN = 'Ram Takeoff Run';
const ANIMATION_JUMP_UP = 'Ram Jump Up';
const ANIMATION_FALL = 'Ram Fall';
const ANIMATION_RUN = 'Ram Run';
const ANIMATION_ATTACK = 'Ram Attack';
const ANIMATION_FAINT = 'Ram Faint';


const LANDING_TIME = 80;

const RUN_VELOCITY = 1200;
const JUMP_VELOCITY = -500;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, controller) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setSize(128, 64);
    this.setMaxVelocity(1200, 600)

    this.time = 0;

    this.isDead = false;

    this.animation = ANIMATION_IDLE;
    this.animationTime = 0;
    this.animationStartTime = null;

    this.controller = controller;
    this.jumpKeyPressed = false;
    this.jumpKeyPressedTime = null;
    this.gameStartedTime = null;

    this.isJumpSoundPlayed = false;

    this.isAlive = true;
    this.onTheGround = false;
    this.isRunning = false;
    this.direction = 'right';
    this.jumpStartTime = 0;

    this.createAnimation();
  }

  createAnimation() {
    this.scene.anims.createFromAseprite('ram-spritesheet');
    this.scene.anims.get(ANIMATION_DASH).repeat = -1;
    this.scene.anims.get(ANIMATION_IDLE).repeat = -1;
    this.scene.anims.get(ANIMATION_DIZZY).repeat = -1;
    this.scene.anims.get(ANIMATION_HURT).repeat = -1;
    this.scene.anims.get(ANIMATION_TAKEOFF_RUN).repeat = -1;
    this.scene.anims.get(ANIMATION_JUMP_UP).repeat = 0;
    this.scene.anims.get(ANIMATION_FALL).repeat = 0;
    this.scene.anims.get(ANIMATION_RUN).repeat = -1;
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
    this.setAnimation(ANIMATION_DASH);
  }

  idle() {
    this.setVelocityX(0);
    this.setAnimation(ANIMATION_IDLE);
  }

  dizzy() {
    this.setAnimation(ANIMATION_DIZZY);
  }

  hurt() {
    this.setAnimation(ANIMATION_HURT);
  }

  takeoffRun() {
    this.setAnimation(ANIMATION_TAKEOFF_RUN);
    this.setVelocityX(-100);
  }

  jump() {
    this.setAnimation(ANIMATION_JUMP_UP);
    this.setVelocityY(JUMP_VELOCITY);

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
    this.setAnimation(ANIMATION_RUN);
    if (direction === 'backward') {
      this.setVelocityX(-RUN_VELOCITY);
      this.flipX = true;
      return;
    }
    this.setVelocityX(RUN_VELOCITY);
    this.flipX = false;
  }

  attack() {
    this.setAnimation(ANIMATION_ATTACK);
  }

  faint() {
    this.setAnimation(ANIMATION_FAINT);
  }


  fall() {
    this.setAnimation(ANIMATION_FALL);
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
    // // continue jump
    // if (this.animation === JUMP && this.jumpKeyPressedTime === this.animationStartTime) {
    //   this.jump();
    //   return;
    // }

    // // start jump
    // // ram on the ground, run and button just pressed
    // if (
    //   this.animation === RUN &&
    //   (this.jumpKeyPressedTime === null || this.time - this.jumpKeyPressedTime < 200) &&
    //   this.jumpKeyPressedTime !== this.gameStartedTime
    // ) {
    //   this.jump();
    //   this.jumpKeyPressedTime = this.time;
    // }

    // if (this.jumpKeyPressedTime === null) {
    //   this.jumpKeyPressedTime = this.time;
    // }

    // // start game
    // if (!this.isMoving()) {
    //   this.run();
    //   this.gameStartedTime = this.time;
    // }
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
