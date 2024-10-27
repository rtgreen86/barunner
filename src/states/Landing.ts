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
    this.sprite.play('Ram Landing');
    if (this.params.isRunningStart) this.sprite.playAfterRepeat('Ram Run');
    else this.sprite.playAfterRepeat('Ram Idle');
  }

  onUpdate() {
    const animationName = this.sprite.anims.getName();
    if (animationName === 'Ram Run') this.sprite.setState('RUN');
    if (animationName === 'Ram Idle') this.sprite.setState('IDLE');
  }
}
