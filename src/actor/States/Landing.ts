import BaseState from './BaseState';

type Params = {
  isRunningStart: boolean,
};

export class Landing extends BaseState<Params> {
  readonly name = 'LANDING';
  readonly animationName = 'Ram Landing';
  readonly runAnimationName = 'Ram Run';
  readonly idleAnimationName = 'Ram Idle';

  onEnter() {
    this.actor.playAnimation(this.animationName);
    if (this.params.isRunningStart) this.actor.playAnimationAfterRepeat(this.runAnimationName);
    else this.actor.playAnimationAfterRepeat(this.idleAnimationName);
  }

  onUpdate() {
    if (this.actor.animationName === this.runAnimationName) this.actor.setState('RUN');
    if (this.actor.animationName === this.idleAnimationName) this.actor.setState('IDLE');
    if (this.actor.animationName === this.idleAnimationName) console.log('to landing');
  }
}
