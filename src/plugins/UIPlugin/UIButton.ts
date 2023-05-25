import * as Phaser from "phaser";
import ICommand from './ICommand';
import IUIButton from "./IUIButton";

const WHITE = 0xffffff;

export default class UIButton extends Phaser.GameObjects.Image implements IUIButton {
  #isPointerDown = false;
  #isFocus = false;
  #upTexture;
  #upFrame;
  #upTint = WHITE;
  #downTexture;
  #downFrame;
  #downTint = WHITE;
  #focusTexture;
  #focusFrame;
  #focusTint = WHITE;
  #disabledTexture;
  #disabledFrame;
  #disabledTint = WHITE;
  #clickCommand?: ICommand = null;
  #enterKey;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number) {
    super(scene, x, y, texture, frame);

    this.#upTexture = texture;
    this.#upFrame = frame;
    this.#downTexture = texture;
    this.#downFrame = frame;
    this.#focusTexture = texture;
    this.#focusFrame = frame;
    this.#disabledTexture = texture;
    this.#disabledFrame = frame;
    this.#enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false);

    this.setInteractive({ cursor: 'pointer' });

    this.on('pointerdown', this.#handlePointerDown, this);
    this.on('pointerup', this.#handlePointerUp, this);
    this.on('pointerout', this.#handlePointerOut, this);
    this.on('uibuttonclick', this.#handleClick, this);
    this.on('uibuttonpress', this.#handlePress, this);
    this.#enterKey.on('down', this.#handleEnterDown, this);
  }

  get isFocus() {
    return this.#isFocus;
  }

  set isFocus(focus) {
    this.#isFocus = focus;
    if (focus) {
      this.setTexture(this.#focusTexture, this.#focusFrame);
      this.setTint(this.#focusTint);
    } else {
      this.setTexture(this.#upTexture, this.#upFrame);
      this.setTint(this.#upTint);
    }
  }

  get isDisabled() {
    return !this.input || !this.input.enabled;
  }

  set isDisabled(disabled) {
    if (disabled) {
      this.disableInteractive();
      this.setTexture(this.#disabledTexture, this.#disabledFrame);
      this.setTint(this.#disabledTint);
      return;
    }

    this.setInteractive();

    if (this.#isFocus) {
      this.setTexture(this.#focusTexture, this.#focusFrame);
      this.setTint(this.#focusTint);
      return;
    }

    this.setTexture(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);
  }

  setDownTexture(texture: string, frame: number) {
    this.#downTexture = texture;
    this.#downFrame = frame;
    return this;
  }

  setDownTint(tint: number) {
    this.#downTint = tint;
    return this;
  }

  setFocusTexture(texture: string, frame: number) {
    this.#focusTexture = texture;
    this.#focusFrame = frame;
    return this;
  }

  setFocusTint(tint: number) {
    this.#focusTint = tint;
    return this;
  }

  setDisabledTexture(texture: string, frame: number) {
    this.#disabledTexture = texture;
    this.#disabledFrame = frame;
    return this;
  }

  setDisabledTint(tint: number) {
    this.#disabledTint = tint;
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
    this.#clickCommand = command;
    return this;
  }

  destroy() {
    this.off('pointerdown', this.#handlePointerDown, this);
    this.off('pointerup', this.#handlePointerUp, this);
    this.off('pointerout', this.#handlePointerOut, this);
    this.off('uibuttonclick', this.#handleClick, this);
    this.off('uibuttonpress', this.#handlePress, this);
    this.#enterKey.off('down', this.#handleEnterDown, this);
    super.destroy();
  }

  onClick(handler: () => void, context: unknown) {
    this.on('uibuttonclick', handler, context);
    return this;
  }

  onceClick(handler: () => void, context: unknown) {
    this.once('uibuttonclick', handler, context);
    return this;
  }

  offClick(handler: () => void, context: unknown) {
    this.off('uibuttonclick', handler, context);
    return this;
  }

  #handlePointerUp(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: 	Phaser.Types.Input.EventData) {
    this.setTexture(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);

    if (this.#isPointerDown) {
      this.emit('uibuttonclick', pointer, localX, localY, event);
    }
  }

  #handlePointerOut() {
    this.#isPointerDown = false;
    this.setTexture(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);
  }

  #handlePointerDown() {
    this.#isPointerDown = true;
    this.setTexture(this.#downTexture, this.#downFrame);
    this.setTint(this.#downTint);
  }

  #handleClick(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: 	Phaser.Types.Input.EventData) {
    if (this.#clickCommand && typeof this.#clickCommand.execute === 'function') {
      this.#clickCommand.execute({ pointer, localX, localY, event });
    }
  }

  #handleEnterDown(key: Phaser.Input.Keyboard.Key, event:	KeyboardEvent) {
    if (this.#isFocus && !this.isDisabled) {
      this.emit('uibuttonpress', key, event);
    }
  }

  #handlePress(key: Phaser.Input.Keyboard.Key, event:	KeyboardEvent) {
    if (this.#clickCommand && typeof this.#clickCommand.execute === 'function') {
      this.#clickCommand.execute({ key, event });
    }
  }
}
