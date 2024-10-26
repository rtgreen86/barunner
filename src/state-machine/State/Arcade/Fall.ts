import { ArcadeState } from './ArcadeState';

export class Fall extends ArcadeState<{animationName: string}> {
  readonly name = 'FALL';

  onEnter() {
    this.sprite.play(this.params.animationName);
  }
}
