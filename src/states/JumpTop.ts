import BaseState from './BaseState';

export class JumpTop extends BaseState<never> {
  readonly name = 'JUMP_TOP';

  onEnter() {
    this.sprite.play('Ram Fly');
  }
}
