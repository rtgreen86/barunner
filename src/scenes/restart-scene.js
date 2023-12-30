import Phaser from 'phaser';

export default class RestartScene extends Phaser.Scene {
  constructor() {
    super('restart-scene');
  }

  create() {
    setTimeout(() => this.scene.start('GameScene'));
    this.scene.stop();
  }
}