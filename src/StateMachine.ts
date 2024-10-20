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

export class StateMachine {
  private states = new Map<string, State>();

  private currentState?: State;

  addState(name: string, config?: StateConfig) {

  }

  setState(name: string) {

  }

  update(time: number) {

  }
}

export default StateMachine;
