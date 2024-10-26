import Phaser from 'phaser';
import { State, ControlState } from '../../interfaces';

export abstract class ArcadeState<Params> implements State {
  abstract readonly name: string;

  protected readonly sprite;
  protected readonly params;

  stateMachine?: ControlState;

  constructor(sprite: Phaser.Physics.Arcade.Sprite, params?: Params) {
    this.sprite = sprite;
    this.params = params;
  }
}

export default ArcadeState;
