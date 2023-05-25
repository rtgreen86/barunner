import * as Phaser from "phaser";
import ICommand from "./ICommand";
import UIButton from './UIButton';
import IUIButtonContainer from "./IUIButtonContainer";

export default class UITextButton extends Phaser.GameObjects.Container implements IUIButtonContainer {
  private button: UIButton;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, texture: string, frame: number) {
    super(scene, x, y);

    this.button = new UIButton(scene, 0, 0, texture, frame);
    this.text = scene.add.text(0, 0, text, {
      font: '32px Arial', color: '#ffffff',
    }).setOrigin(0.5, 0.5);

    this.add(this.button);
    this.add(this.text);

    this.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);
  }

  get isFocus() {
    return this.button.isFocus;
  }

  set isFocus(focus) {
    this.button.isFocus = focus;
  }

  get isDisabled() {
    return this.button.isDisabled;
  }

  set isDisabled(disabled) {
    this.button.isDisabled = disabled;
  }

  get buttonWidth() {
    return this.button.width;
  }

  get buttonHeight() {
    return this.button.height;
  }

  setText(text: string) {
    this.text.text = text;
    return this;
  }

  setTextStyle(style: object) {
    this.text.setStyle(style);
    return this;
  }

  setDownTexture(texture: string, frame: number) {
    this.button.setDownTexture(texture, frame);
    return this;
  }

  setDownTint(tint: number) {
    this.button.setDownTint(tint);
    return this;
  }

  setFocusTexture(texture: string, frame: number) {
    this.button.setFocusTexture(texture, frame);
    return this;
  }

  setFocusTint(tint: number) {
    this.button.setFocusTint(tint);
    return this;
  }

  setDisabledTexture(texture: string, frame: number) {
    this.button.setDisabledTexture(texture, frame);
    return this;
  }

  setDisabledTint(tint: number) {
    this.button.setDisabledTint(tint);
    return this;
  }

  setFocus(focus: boolean) {
    this.isFocus = focus;
    return this;
  }

  setDisabled(disabled: boolean) {
    this.isDisabled = disabled;
    return this;
  }

  setClickCommand(command: ICommand) {
    this.button.setClickCommand(command);
    return this;
  }

  onClick(handler: () => void, context: unknown) {
    this.button.onClick(handler, context);
    return this;
  }

  onceClick(handler: () => void, context: unknown) {
    this.button.onceClick(handler, context);
    return this;
  }

  offClick(handler: () => void, context: unknown) {
    this.button.offClick(handler, context);
    return this;
  }
}
