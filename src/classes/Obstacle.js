import { Physics } from 'Phaser';

export default class Obstacle extends Physics.Arcade.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  spawn(x, y) {
    this.scene.physics.world.enable(this);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(0);
    this.setPosition(x, y);
    this.setPushable(false);
  }

  kill() {
    this.setActive(false);
    this.setVisible(false);
    this.physics.world.disable(this);
  }
}
