import { ArcadeState } from './ArcadeState';

export class Idle extends ArcadeState<{
  animationName: string,
  sharedState: {isRunningStart: boolean},
}> {
  readonly name = 'IDLE';

  onEnter() {
    this.params.sharedState.isRunningStart = false;
    this.sprite.setVelocityX(0);
    this.sprite.play(this.params.animationName);
  }
}
