export interface ControlState {
  readonly currentStateName: string;

  isCurrentState(name: string): boolean;
  setState(name: string): this;
}

export interface StateConfig {
  onEnter?: () => void;
  onUpdate?: (time: number) => void;
  onExit?: () => void;
}

export interface State extends StateConfig {
  readonly name: string;
  stateMachine?: ControlState;
}
