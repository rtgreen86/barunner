import Phaser from 'phaser';
import UIButton from './UIButton';

export default class UITextButton extends Phaser.GameObjects.Container {
  #button;
  #text;

  constructor(scene, x, y, text, texture, frame) {
    super(scene, x, y);

    this.#button = new UIButton(scene, 0, 0, texture, frame);
    this.#text = scene.add.text(0, 0, text, {
      font: '32px Arial', color: '#ffffff',
    }).setOrigin(0.5, 0.5);

    this.add(this.#button);
    this.add(this.#text);

    this.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);
  }

  get isFocus() {
    return this.#button.isFocus;
  }

  set isFocus(focus) {
    this.#button.isFocus = focus;
  }

  get isDisabled() {
    return this.#button.isDisabled;
  }

  set isDisabled(disabled) {
    this.#button.isDisabled = disabled;
  }

  get width() {
    return this.#button.width;
  }

  get height() {
    return this.#button.height;
  }

  setDownTexture(texture, frame) {
    this.#button.setDownTexture(texture, frame);
    return this;
  }

  setDownTint(tint) {
    this.#button.setDownTint(tint);
    return this;
  }

  setFocusTexture(texture, frame) {
    this.#button.setFocusTexture(texture, frame);
    return this;
  }

  setFocusTint(tint) {
    this.#button.setFocusTint(tint);
    return this;
  }

  setDisabledTexture(texture, frame) {
    this.#button.setDisabledTexture(texture, frame);
    return this;
  }

  setDisabledTint(tint) {
    this.#button.setDisabledTint(tint);
    return this;
  }

  setFocus(focus) {
    this.isFocus = focus;
    return this;
  }

  setDisabled(disabled) {
    this.isDisabled = disabled;
    return this;
  }

  setClickCommand(command) {
    this.#button.setClickCommand(command);
    return this;
  }

  onClick(handler, context) {
    this.#button.onClick(handler, context);
    return this;
  }

  oneClick(handler, context) {
    this.#button.oneClick(handler, context);
    return this;
  }

  offClick(handler, context) {
    this.#button.offClick(handler, context);
    return this;
  }
}
