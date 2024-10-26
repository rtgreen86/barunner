import { ArcadeState } from './ArcadeState';

const DIRECTION_RIGHT = 'right';
const DIRECTION_LEFT = 'left';

export class Run extends ArcadeState<{
  animationName: string,
  direction: typeof DIRECTION_RIGHT | typeof DIRECTION_LEFT,
  runVelocity: number,
  sharedState: {
    isRunningStart: boolean,
  }
}> {
  readonly name = 'RUN';

  onEnter() {
    this.params.sharedState.isRunningStart = true;
    this.sprite.play(this.params.animationName, true);
    if (this.params.direction === DIRECTION_LEFT) this.sprite.setVelocityX(-this.params.runVelocity);
    else this.sprite.setVelocityX(this.params.runVelocity);
  }
}
