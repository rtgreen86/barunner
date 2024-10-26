export interface HasState {
  readonly stateName: string;
  isCurrentState(name: string): boolean;
  setState(name: string): this;
}
