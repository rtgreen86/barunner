import BaseState from './BaseState';

type Params = {
  jumpVelocity: number,
  jumpMaxTime: number,
}

export class JumpUp extends BaseState<Params> {
  readonly name = 'JUMP_UP';
  readonly animationName = 'Ram Jump Up';
  private jumpStartTime = 0;

  onEnter() {
    this.actor.playAnimation(this.animationName);
    this.actor.setVelocityY(this.params.jumpVelocity);
    this.jumpStartTime = 0;
  }

  onUpdate(time: number) {
    if (!this.jumpStartTime) this.jumpStartTime = time;
    if (time - this.jumpStartTime <= this.params.jumpMaxTime) this.actor.setVelocityY(this.params.jumpVelocity);
    else this.actor.stateMachine.setState('JUMP_TOP');
  }
}
