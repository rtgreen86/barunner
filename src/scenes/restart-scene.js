import Phaser from 'phaser';

export default class RestartScene extends Phaser.Scene {
  constructor() {
    super('restart-scene');
  }

  create() {
    this.scene.start('GameScene');
    this.scene.stop();
  }
}