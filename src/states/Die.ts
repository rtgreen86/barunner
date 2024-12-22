import BaseState from './BaseState';
import * as CONST from '../const';

export class Die extends BaseState<never> {
  readonly name = 'DIE';

  onEnter() {
    this.sprite.play('Ram Dizzy');
    if (!this.sprite.scene.scene.isActive(CONST.SCENE_KEYS.GAMEOVER_SCENE))
      this.sprite.scene.scene.run(CONST.SCENE_KEYS.GAMEOVER_SCENE);
  }
}
