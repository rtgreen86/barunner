import Phaser from "phaser";

export default class UIButton extends Phaser.GameObjects.Image {
  #isPointerDown = false;

  #downTint = 0xffffff;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.setInteractive({ cursor: 'pointer' });

    this.on('pointerdown', this.#handlePointerDown, this);
    this.on('pointerup', this.#handlePointerUp, this);
    this.on('pointerout', this.#handlePointerOut, this);
  }

  setDownTint(tint) {
    this.#downTint = tint;
    return this;
  }

  #handlePointerDown() {
    this.setTint(this.#downTint);
    this.#isPointerDown = true;
  }

  #handlePointerUp(pointer, x, y) {
    this.clearTint();
    if (this.#isPointerDown) {
      this.emit('uibuttonclick', this, pointer, x, y);
    }
  }

  #handlePointerOut() {
    this.clearTint();
    this.#isPointerDown = false;
  }
}
