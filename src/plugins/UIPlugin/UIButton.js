import Phaser from "phaser";

const WHITE = 0xffffff;

export default class UIButton extends Phaser.GameObjects.Image {
  #isPointerDown = false;
  #isActive = false;
  #upTexture;
  #upFrame;
  #upTint = WHITE;
  #downTexture;
  #downFrame;
  #downTint = WHITE;
  #activeTexture;
  #activeFrame;
  #activeTint = WHITE;
  #disabledTexture;
  #disabledFrame;
  #disabledTint = WHITE;
  #clickCommand = null;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.#upTexture = texture;
    this.#upFrame = frame;
    this.#downTexture = texture;
    this.#downFrame = frame;
    this.#activeTexture = texture;
    this.#activeFrame = frame;
    this.#disabledTexture = texture;
    this.#disabledFrame = frame;

    this.setInteractive({ cursor: 'pointer' });

    this.on('pointerdown', this.#handlePointerDown, this);
    this.on('pointerup', this.#handlePointerUp, this);
    this.on('pointerout', this.#handlePointerOut, this);
    this.on('uibuttonclick', this.#handleClick, this);
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

  setActiveTexture(texture, frame) {
    this.#activeTexture = texture;
    this.#activeFrame = frame;
    return this;
  }

  setActiveTint(tint) {
    this.#activeTint = tint;
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

  setActive(active) {
    this.#isActive = active;

    if (active) {
      this.setFrame(this.#activeTexture, this.#activeFrame);
      this.setTint(this.#activeTint);
      return this
    }

    this.setFrame(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);
    return this;
  }

  setDisabled(disabled) {
    if (disabled) {
      this.disableInteractive();
      this.setFrame(this.#disabledTexture, this.#disabledFrame);
      this.setTint(this.#disabledTint);
      return this;
    }

    this.setInteractive();
    this.setFrame(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);
    return this;
  }

  setClickCommand(command) {
    this.#clickCommand = command;
    return this;
  }

  onClick(handler, context) {
    this.on('uibuttonclick', handler, context);
    return this;
  }

  oneClick(handler, context) {
    this.oneClick('uibuttonclick', handler, context);
    return this;
  }

  offClick(handler) {
    this.off('uibuttonclick', handler);
    return this;
  }

  #handlePointerUp(pointer, x, y) {
    this.setTexture(this.#upTexture, this.#upFrame);
    this.setTint(this.#upTint);

    if (this.#isPointerDown) {
      this.emit('uibuttonclick', pointer, x, y);
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

  #handleClick(pointer, x, y) {
    if (this.#clickCommand && typeof this.#clickCommand.execute === 'function') {
      this.#clickCommand.execute(pointer, x, y);
    }
  }
}
