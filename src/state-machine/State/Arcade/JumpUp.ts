import { ArcadeState } from './ArcadeState';

export class JumpUp extends ArcadeState<{
  animationName: string,
  jumpVelocity: number,
  jumpMaxTime: number,
}> {
  readonly name = 'JUMP_UP';

  private jumpStartTime = 0;

  onEnter() {
    this.sprite.play(this.params.animationName);
    this.sprite.setVelocityY(this.params.jumpVelocity);
    this.jumpStartTime = 0;
  }

  onUpdate(time: number) {
    if (!this.jumpStartTime) this.jumpStartTime = 0;
    if (time - this.jumpStartTime <= this.params.jumpMaxTime) this.sprite.setVelocityY(this.params.jumpVelocity);
    else this.stateMachine.setState('JUMP_TOP');
  }
}
