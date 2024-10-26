import BaseState from './BaseState';

const DIRECTION_RIGHT = 'right';
const DIRECTION_LEFT = 'left';

type Params = {
  direction: typeof DIRECTION_RIGHT | typeof DIRECTION_LEFT,
  runVelocity: number,
  isRunningStart: boolean,
};

export class Run extends BaseState<Params> {
  readonly name = 'RUN';
  readonly animationName = 'Ram Run';

  onEnter() {
    this.params.isRunningStart = true;
    this.actor.playAnimation(this.animationName, true);
    if (this.params.direction === DIRECTION_LEFT) this.actor.setVelocityX(-this.params.runVelocity);
    else this.actor.setVelocityX(this.params.runVelocity);
  }
}
