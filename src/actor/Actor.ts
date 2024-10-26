export interface Actor {
  animationName: string;
  velocityX: number;
  velocityY: number;
  stateName: string;

  isCurrentState(stateName: string): boolean;
  playAnimation(animationName: string, repeat?: boolean): this;
  playAnimationAfterRepeat(animationName: string): this;
  setVelocityX(value: number): this;
  setVelocityY(value: number): this;
  setState(stateName: string): this;
}
