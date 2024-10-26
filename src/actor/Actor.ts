import { HasState } from '../state-machine';

export interface Actor {
  readonly stateMachine: HasState;

  animationName: string;
  velocityX: number;
  velocityY: number;

  playAnimation(animationName: string, repeat?: boolean): this;
  playAnimationAfterRepeat(animationName: string): this;
  setVelocityX(value: number): this;
  setVelocityY(value: number): this;
}
