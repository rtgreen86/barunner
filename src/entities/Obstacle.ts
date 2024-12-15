import Phaser from 'phaser';
import { TextureKeys } from '../const';

export default class Obstacle extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    const rock = scene.add.sprite(0, 0, TextureKeys.Obstacles)
      .setOrigin(0.5, 1);
    this.add(rock);
  }
}
