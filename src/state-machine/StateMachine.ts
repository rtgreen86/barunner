type Context = { state: StateName };

type StateName = string | number;

export interface StateConfig<T extends Context> {
  onEnter?: (this: T) => void;
  onUpdate?: (this: T, time: number) => void;
  onExit?: (this: T) => void;
}

let lastId = 0;

export class StateMachine<T extends Context> {
  private id = (++lastId).toString();

  private states = new Map<StateName, StateConfig<T>>();

  private isChangingState = false;

  private changeStateQueue: StateName[] = [];

  private readonly context;

  constructor(context: T, id?: string) {
    this.id = id ?? this.id;
    this.context = context;
  }

  get currentState() {
    return this.context.state;
  }

  get currentConfig() {
    return this.states.get(this.currentState);
  }

  isCurrentState(name: StateName) {
    return this.currentState === name;
  }

  addState(name: StateName, config?: StateConfig<T>): this {
    this.states.set(name, {
      onEnter: config?.onEnter,
      onUpdate: config?.onUpdate,
      onExit: config?.onExit
    });
    return this;
  }

  setState(name: StateName) {
    if (!this.states.has(name)) {
      console.warn(`[StateMachine (${this.id})] tried to change to unknown state ${name}.`);
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
    console.info(`[StateMachine (${this.id})] change from ${this.currentState ?? 'none'} to ${name}`);
    this.currentConfig?.onExit?.call?.(this.context);
    this.context.state = name; // change current state and config
    this.currentConfig?.onEnter?.call?.(this.context);
    this.isChangingState = false;

    return this;
  }

  update(time: number) {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!);
    }
    this.currentConfig?.onUpdate?.call?.(this.context, time);
    return this;
  }
}

export default StateMachine;
