import BaseState from './BaseState';

export class Die extends BaseState<never> {
  readonly name = 'DIE';

  onEnter() {
    // this.sprite.setVelocity(0, 0);
    this.sprite.play('Ram Dizzy');
  }
}
