import { Actor } from '../Actor';
import { State } from '../../state-machine';

export default abstract class BaseState<Params = {}> implements State {
  abstract readonly name: string;

  protected readonly actor;
  protected readonly params;

  constructor(actor: Actor, params?: Params) {
    this.actor = actor;
    this.params = params;
  }
}
