export interface StateConfig {
  onEnter?: () => void;
  onUpdate?: (time: number) => void;
  onExit?: () => void;
}

export interface State extends StateConfig {
  readonly name: string;
}
