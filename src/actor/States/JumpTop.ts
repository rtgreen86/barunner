import BaseState from './BaseState';

export class JumpTop extends BaseState {
  readonly name = 'JUMP_TOP';
  readonly animationName = 'Ram Fly';

  onEnter() {
    this.actor.playAnimation(this.animationName);
  }
}
