import Phaser from "phaser";

export default class UIButton extends Phaser.GameObjects.Image {
  #isPointerDown = false;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.setInteractive({ cursor: 'pointer' });

    this.on('pointerdown', this.#handlePointerDown, this);
    this.on('pointerup', this.#handlePointerUp, this);
    this.on('pointerout', this.#handlePointerOut, this);
  }

  #handlePointerDown() {
    this.#isPointerDown = true;
  }

  #handlePointerUp(pointer, x, y) {
    if (this.#isPointerDown) {
      this.emit('uibuttonclick', this, pointer, x, y);
    }
  }

  #handlePointerOut() {
    this.#isPointerDown = false;
  }
}
