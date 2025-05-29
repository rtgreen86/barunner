import { Queue } from './Queue';
import { Context, StringOrNumber, StateConfig } from './types';

let lastId = 0;

export class StateMachine<T extends Context> {
  private id = (++lastId).toString();

  private states = new Map<StringOrNumber, StateConfig<T>>();

  private queue = new Queue();

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

  addState(name: StringOrNumber, config: StateConfig<T> = {}): this {
    this.states.set(name, config);
    return this;
  }

  setState(name: StringOrNumber) {
    if (!this.states.has(name)) {
      console.warn(`[StateMachine (${this.id})] tried to change to unknown state ${name}.`);
      return this;
    }

    this.queue.enqueue(() => {
      if (this.currentState === name) {
        return this;
      }

      console.info(`[StateMachine (${this.id})] change from ${this.currentState ?? 'none'} to ${name}`);
      this.currentConfig?.onExit?.call?.(this.context);
      this.context.state = name; // change current state and config
      this.currentConfig?.onEnter?.call?.(this.context);
    });

    return this;
  }

  update(time: number, delta: number) {
    this.queue.update();
    this.currentConfig?.onUpdate?.call?.(this.context, time, delta);
    return this;
  }
}

export default StateMachine;
