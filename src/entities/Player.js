import { Physics } from 'Phaser';

// const IDLE = 'Idle';
// const JUMP = 'Idle'; // 'ram-jump';
// const RUN = 'Idle'; // 'ram-run';
const DIE = 'Idle'; //  'ram-die';

const ANIMATION_IDLE = 'Ram Idle';
const ANIMATION_JUMP = 'Ram Jump Up';
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

const LANDING_TIME = 80;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, controller) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.runVelocity = 1200;
    this.jumpVelocity = -500;
    this.jumpMaxTime = 300;

    this.onTheGround = false;
    this.jumpTime = 0;


    // this.startFallingVelocity = 10;

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
    this.isRunning = false;
    this.direction = Player.DIRECTION_RIGHT;
    this.jumpStartTime = 0;

    this.setSize(128, 64);
    this.setMaxVelocity(1200, 600)
    this.createAnimation();
  }

  static DIRECTION_RIGHT = 'right';
  static DIRECTION_LEFT = 'left';

  get isFalling() {
    return this.anims.getName() === ANIMATION_FALL;
  }

  get isJumping() {
    return this.anims.getName() === ANIMATION_JUMP;
  }

  createAnimation() {
    this.scene.anims.createFromAseprite('ram-spritesheet');
    this.scene.anims.get(ANIMATION_DASH).repeat = -1;
    this.scene.anims.get(ANIMATION_IDLE).repeat = -1;
    this.scene.anims.get(ANIMATION_DIZZY).repeat = -1;
    this.scene.anims.get(ANIMATION_HURT).repeat = -1;
    this.scene.anims.get(ANIMATION_TAKEOFF_RUN).repeat = -1;
    this.scene.anims.get(ANIMATION_JUMP).repeat = 0;
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
    this.play(ANIMATION_IDLE);
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
    this.jumpTime = 0;
    this.onTheGround = false;
    this.play(ANIMATION_JUMP);
    this.setVelocityY(this.jumpVelocity);
  }

  continueJump(delta) {
    this.jumpTime += delta;
    if (this.jumpTime <= this.jumpMaxTime) {
      this.setVelocityY(this.jumpVelocity);
    } else {
      this.play(ANIMATION_FLY);
    }
  }

  fly() {
    this.play(ANIMATION_FLY);
  }

  fall() {
    this.play(ANIMATION_FALL);
  }

  landing() {
    this.onTheGround = true;
    if (this.isFalling) {
      this.play(ANIMATION_LANDING);
      this.playAfterRepeat(ANIMATION_IDLE);
    }
  }



  run(direction) {
    this.setAnimation(ANIMATION_RUN);
    if (direction === 'backward') {
      this.setVelocityX(-this.runVelocity);
      this.flipX = true;
      return;
    }
    this.setVelocityX(this.runVelocity);
    this.flipX = false;
  }

  attack() {
    this.setAnimation(ANIMATION_ATTACK);
  }

  faint() {
    this.setAnimation(ANIMATION_FAINT);
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

  // isFalling() {
  //   return this.body.velocity.y > this.startFallingVelocity;
  // }

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
    // if (this.isDead) {
    //   return;
    // }

    // this.animationTime += delta;
    // this.time = time;

    // // process user input
    // if (this.controller.isJumpDown) {
    //   this.onJumpPressed();
    // }
    // if (this.jumpKeyPressedTime !== null && !this.controller.isJumpDown) {
    //   this.onJumpReleased();
    // }

    // falling and landing
    // if (this.isFalling()) {
    //   this.fall();
    // }
    // if (this.animation === FALL && !this.isFalling()) {
    //   this.landing();
    // }
    // if (this.animation === LANDING && this.animationTime > LANDING_TIME) {
    //   this.idle();
    // }
  }

  respawn() {
    this.isDead = false;
    this.idle();
  }
}
