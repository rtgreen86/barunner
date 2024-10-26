import { ArcadeState } from './ArcadeState';

export class JumpTop extends ArcadeState<{animationName: string}> {
  readonly name = 'JUMP_TOP';

  onEnter() {
    this.sprite.play(this.params.animationName);
  }
}
