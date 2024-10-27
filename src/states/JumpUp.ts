import BaseState from './BaseState';

type Params = {
  jumpVelocity: number,
  jumpMaxTime: number,
}

export class JumpUp extends BaseState<Params> {
  readonly name = 'JUMP_UP';

  private jumpStartTime = 0;

  onEnter() {
    this.sprite.play('Ram Jump Up');
    this.sprite.setVelocityY(this.params.jumpVelocity);
    this.jumpStartTime = 0;
  }

  onUpdate(time: number) {
    if (!this.jumpStartTime) this.jumpStartTime = time;
    if (time - this.jumpStartTime <= this.params.jumpMaxTime) this.sprite.setVelocityY(this.params.jumpVelocity);
    else this.sprite.setState('JUMP_TOP');
  }
}
