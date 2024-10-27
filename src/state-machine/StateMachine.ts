import { State, StateConfig } from './State';

let lastId = 0;

type Context = {
  state: number | string;
  setState: (state: number | string) => Context;
}

export class StateMachine {
  private id = (++lastId).toString();

  private states = new Map<string, State>();

  private isChangingState = false;

  private changeStateQueue: string[] = [];

  private readonly context;

  constructor(gameObject: Context, id?: string) {
    this.id = id ?? this.id;
    this.context = gameObject;
  }

  get currentStateName() {
    return this.context.state;
  }

  get currentState() {
    return this.states.get(this.currentStateName.toString());
  }

  addState(name: string, config?: StateConfig): this
  addState(state: State): this
  addState(nameOrState: string | State, config?: StateConfig): this {
    if (typeof nameOrState === 'object') {
      this.states.set(nameOrState.name, nameOrState);
      return this;
    }

    this.states.set(nameOrState, {
      name: nameOrState,
      onEnter: config?.onEnter?.bind(this.context),
      onUpdate: config?.onUpdate?.bind(this.context),
      onExit: config?.onExit?.bind(this.context)
    });

    return this;
  }

  isCurrentState(name: string) {
    return this.currentStateName === name;
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
    this.context.state = name;
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
