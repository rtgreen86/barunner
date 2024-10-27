import BaseState from './BaseState';

type Params = {
  isRunningStart: boolean,
};

export class Idle extends BaseState<Params> {
  readonly name = 'IDLE';

  onEnter() {
    this.params.isRunningStart = false;
    this.sprite.setVelocityX(0);
    this.sprite.play('Ram Idle');
  }
}
