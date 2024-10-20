// See: https://blog.ourcade.co/posts/2021/character-logic-state-machine-typescript/
// See: https://blog.ourcade.co/posts/2020/state-pattern-character-movement-phaser-3/

export interface StateConfig {
  onEntry?: () => void;
  onUpdate?: (time: number) => void;
  onExit?: () => void;
}

export interface State extends StateConfig {
  name: string,
}

let lastId = 0;

export class StateMachine {
  private id = (++lastId).toString();
  private context?: unknown;
  private states = new Map<string, State>();
  private currentState?: State;

  constructor(context?: unknown, id?: string) {
    this.id = id ?? this.id;
    this.context = context;
  }

  addState(name: string, config?: StateConfig) {

  }

  setState(name: string) {

  }

  update(time: number) {

  }
}

export default StateMachine;
