import { ArcadeState } from './ArcadeState';

export class Landing extends ArcadeState<{
  animationName: string,
  runAnimationName: string,
  idleAnimationName: string,
  sharedState: {
    isRunningStart: boolean,
  }
}> {
  readonly name = 'LANDING';

  onEnter() {
    this.sprite.play(this.params.animationName);
    if (this.params.sharedState.isRunningStart) this.sprite.playAfterRepeat(this.params.runAnimationName);
    else this.sprite.playAfterRepeat(this.params.idleAnimationName);
  }

  onUpdate() {
    const animName = this.sprite.anims.getName();
    if (animName === this.params.runAnimationName) this.stateMachine.setState('RUN');
    if (animName === this.params.idleAnimationName) this.stateMachine.setState('IDLE');
  }
}
