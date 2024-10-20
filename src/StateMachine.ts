// See: https://blog.ourcade.co/posts/2021/character-logic-state-machine-typescript/
// See: https://blog.ourcade.co/posts/2020/state-pattern-character-movement-phaser-3/

export interface StateConfig {
  onEnter?: () => void;
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
  private isChangingState = false;
  private changeStateQueue: string[] = [];

  /**
   *
   * @param context - (optional) context for handlers
   * @param id - (optional) state machine id (e.g. player)
   */
  constructor(context?: unknown, id?: string) {
    this.id = id ?? this.id;
    this.context = context;
  }

  /**
   *
   * @param name - state name (e.g. idle)
   * @param config - (optional) handlers
   * @returns @this
   */
  addState(name: string, config?: StateConfig) {
    this.states.set(name, {
      name,
      onEnter: config?.onEnter?.bind(this.context),
      onUpdate: config?.onUpdate?.bind(this.context),
      onExit: config?.onExit?.bind(this.context)
    });
    return this;
  }

  getCurrentStateName() {
    return this.currentState?.name
  }

  isCurrentState(name: string) {
    return this.getCurrentStateName() === name;
  }

  setState(name: string) {
    if (!this.states.has(name)) {
      console.log(`Tried to change to unknown state: ${name}`);
      return this;
    }

    if (this.isCurrentState(name)) {
      return this;
    }

    if (this.isChangingState) {
      this.changeStateQueue.push(name);
      return this;
    }

    this.isChangingState = true;
    console.log(`[StateMachine (${this.id})] change from ${this.currentState?.name ?? 'none'} to ${name}`);
    this.currentState?.onExit?.();
    this.currentState = this.states.get(name);
    this.currentState?.onEnter?.();
    this.isChangingState = false;
    return this;
  }

  update(time: number) {
    if (this.changeStateQueue.length > 0) this.setState(this.changeStateQueue.shift());
    this.currentState?.onUpdate?.(time);
    return this;
  }
}

export default StateMachine;
