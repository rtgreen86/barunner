import { Physics } from 'Phaser';

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, cursor) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.cursor = cursor;
    this.setSize(45, 30);
    this.idle();
  }

  update(time, delta) {
    if (this.status === 'jumping') {
      this.jumpTime += delta;
    }
    if (
      (this.status === 'running' || this.status === 'idle') &&
      this.cursor.space.isDown
    ) {
      this.jump();
    }
    if (this.status === 'jumping' && this.cursor.space.isDown && this.jumpTime <= 300) {
      this.body.setVelocityY(-250);
    }
    if (this.status === 'falling' && this.body.velocity.y === 0) {
      this.status = 'idle';
    }
    if (this.status === 'idle' && this.body.velocity.y === 0 && this.scene.gameStarted) {
      this.run();
    }
    if (this.body.velocity.y > 0 && this.status !== 'falling') {
      this.fall();
    }
    if (this.status === 'idle') {
      this.play('ram-idle', true);
    }
    if (this.status === 'running') {
      this.play('ram-run', true);
    }
  }

  idle() {
    this.status = 'idle';
    this.play('ram-idle');
  }

  jump() {
    this.status = 'jumping';
    this.jumpTime = 0;
    this.play('ram-jump', true, 0);

    // start game on first jumb
    this.scene.gameStarted = true;
  }

  run() {
    this.status = 'running';
    this.setVelocityX(600);
  }

  fall() {
    this.status = 'falling';
    this.play('ram-fall', true);
  }
}