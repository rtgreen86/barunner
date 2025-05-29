export type StringOrNumber = string | number;

export interface Context {
  state: StringOrNumber;
}

export interface StateConfig<T extends Context> {
  onEnter?: (this: T) => void;
  onUpdate?: (this: T, time: number, delta: number) => void;
  onExit?: (this: T) => void;
}
