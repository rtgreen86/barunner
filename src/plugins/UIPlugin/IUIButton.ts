import ICommand from './ICommand';

export default interface IUIButton extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.Transform {
  isFocus: boolean;
  isDisabled: boolean;
  setDownTexture(texture: string, frame: number): this;
  setDownTint(tint: number): this;
  setFocusTexture(texture: string, frame: number): this;
  setFocusTint(tint: number): this;
  setDisabledTexture(texture: string, frame: number): this;
  setDisabledTint(tint: number): this;
  setFocus(focus: boolean): this;
  setDisabled(disabled: boolean): this;
  setClickCommand(command: ICommand): this;
  onClick(handler: () => void, context: unknown): this;
  onceClick(handler: () => void, context: unknown): this;
  offClick(handler: () => void, context: unknown): this;
}
