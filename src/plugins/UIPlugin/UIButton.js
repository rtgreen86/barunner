import Phaser from "phaser";

const WHITE = 0xffffff;

export default class UIButton extends Phaser.GameObjects.Image {
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
  #clickCommand = null;
  #enterKey;

  constructor(scene, x, y, texture, frame) {
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

  setDownTexture(texture, frame) {
    this.#downTexture = texture;
    this.#downFrame = frame;
    return this;
  }

  setDownTint(tint) {
    this.#downTint = tint;
    return this;
  }

  setFocusTexture(texture, frame) {
    this.#focusTexture = texture;
    this.#focusFrame = frame;
    return this;
  }

  setFocusTint(tint) {
    this.#focusTint = tint;
    return this;
  }

  setDisabledTexture(texture, frame) {
    this.#disabledTexture = texture;
    this.#disabledFrame = frame;
    return this;
  }

  setDisabledTint(tint) {
    this.#disabledTint = tint;
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

  onClick(handler, context) {
    this.on('uibuttonclick', handler, context);
    return this;
  }

  oneClick(handler, context) {
    this.oneClick('uibuttonclick', handler, context);
    return this;
  }

  offClick(handler, context) {
    this.off('uibuttonclick', handler, context);
    return this;
  }

  #handlePointerUp(pointer, currentryOver) {
    this.setTexture(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);

    if (this.#isPointerDown) {
      this.emit('uibuttonclick', pointer, currentryOver);
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

  #handleClick(pointer, currentryOver) {
    if (this.#clickCommand && typeof this.#clickCommand.execute === 'function') {
      this.#clickCommand.execute({ pointer, currentryOver });
    }
  }

  #handleEnterDown(key, keyboardEvent) {
    if (this.#isFocus && !this.isDisabled) {
      this.emit('uibuttonpress', key, keyboardEvent);
    }
  }

  #handlePress(key, keyboardEvent) {
    if (this.#clickCommand && typeof this.#clickCommand.execute === 'function') {
      this.#clickCommand.execute({ key, keyboardEvent });
    }
  }
}
