import { Physics } from 'Phaser';

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

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.runVelocity = 1200;
    this.jumpVelocity = -500;
    this.jumpMaxTime = 300;
    this.jumpTime = 0;
    this.isRunning = false;
    this.direction = DIRECTION_RIGHT;


    this.initAnimation();

    this.setSize(128, 64);
    this.setMaxVelocity(1200, 600)
    this.setData('isAlive', true);
    this.setBounceX(0.7);
    this.play(ANIMATION_IDLE);
  }

  initAnimation() {
    this.scene.anims.createFromAseprite(this.texture.key);
    this.scene.anims.get(ANIMATION_DASH).repeat = -1;
    this.scene.anims.get(ANIMATION_IDLE).repeat = -1;
    this.scene.anims.get(ANIMATION_DIZZY).repeat = -1;
    this.scene.anims.get(ANIMATION_HURT).repeat = -1;
    this.scene.anims.get(ANIMATION_TAKEOFF_RUN).repeat = -1;
    this.scene.anims.get(ANIMATION_JUMP_UP).repeat = 0;
    this.scene.anims.get(ANIMATION_FALL).repeat = 0;
    this.scene.anims.get(ANIMATION_RUN).repeat = -1;
  }

  get isJumping() {
    return this.anims.getName() === ANIMATION_JUMP_UP;
  }




  get direction() {
    return this.flipX ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }

  set direction(value) {
    this.flipX = value === DIRECTION_LEFT;
  }



  jumpStart() {
    this.jumpTime = 0;
    this.play(ANIMATION_JUMP_UP);
    this.setVelocityY(this.jumpVelocity);
  }

  jumpContinue(delta) {
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



  idle() {
    this.setVelocityX(0);
    this.play(ANIMATION_IDLE);
  }

  takeoffRun() {
    this.play(ANIMATION_TAKEOFF_RUN);
    this.setVelocityX(-100);
  }

  run() {
    this.isRunning = true;
    this.play(ANIMATION_RUN);
    this.setVelocityX(
      this.direction === DIRECTION_LEFT
        ? -this.runVelocity
        : this.runVelocity
    );
  }


  dash() {
    this.play(ANIMATION_DASH);
  }


  dizzy() {
    this.play(ANIMATION_DIZZY);
  }

  hurt() {
    this.play(ANIMATION_HURT);
  }






  landing() {
    if (!this.isFalling) {
      return;
    }
    if (this.isRunning) {
      this.run();
      this.play(ANIMATION_LANDING);
      this.playAfterRepeat(ANIMATION_RUN);
    } else {
      this.idle();
      this.play(ANIMATION_LANDING);
      this.play(ANIMATION_IDLE);
    }
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
}
