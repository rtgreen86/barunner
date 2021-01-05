import { Physics } from 'Phaser';

export default class Obstacle extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setSize(70, 60);
    //this.setOrigin(0, 0)
  }




}
