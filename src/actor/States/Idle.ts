import BaseState from './BaseState';

type Params = {
  isRunningStart: boolean,
};

export class Idle extends BaseState<Params> {
  readonly name = 'IDLE';
  readonly animationName = 'Ram Idle';

  onEnter() {
    this.params.isRunningStart = false;
    this.actor.setVelocityX(0);
    this.actor.playAnimation(this.animationName);
  }
}
