import BaseState from './BaseState';
import * as CONST from '../const';

export class Die extends BaseState<never> {
  readonly name = 'DIE';

  onEnter() {
    this.sprite.play('Ram Dizzy');
    this.sprite.emit('dead');
  }
}
