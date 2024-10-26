import BaseState from './BaseState';

export class Fall extends BaseState {
  readonly name = 'FALL';
  readonly animationName = 'Ram Fall';

  onEnter() {
    this.actor.playAnimation(this.animationName);
  }
}
