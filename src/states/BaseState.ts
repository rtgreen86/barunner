import Phaser from 'phaser';
import { State } from '../state-machine';

export default abstract class BaseState<Params> implements State {
  abstract readonly name: string;

  protected readonly sprite;

  protected readonly params;

  constructor(sprite: Phaser.Physics.Arcade.Sprite, params?: Params) {
    this.sprite = sprite;
    this.params = params;
  }
}
