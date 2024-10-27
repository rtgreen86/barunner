import BaseState from './BaseState';

export class Fall extends BaseState<never> {
  readonly name = 'FALL';

  onEnter() {
    this.sprite.play('Ram Fall');
  }
}
