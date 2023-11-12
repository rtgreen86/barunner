const GRAY = 0x808080;

export default class Clickable {
  #isPointerDown = false;

  #gameObject;

  constructor(gameObject) {
    this.#gameObject = gameObject;

    this.#gameObject.on('pointerdown', this.#handlePointerDown, this);
    this.#gameObject.on('pointerup', this.#handlePointerUp, this);
    this.#gameObject.on('pointerout', this.#handlePointerOut, this);
  }

  destroy() {
    this.#gameObject.off('pointerdown', this.#handlePointerDown, this);
    this.#gameObject.off('pointerup', this.#handlePointerUp, this);
    this.#gameObject.off('pointerout', this.#handlePointerOut, this);
  }

  #handlePointerDown() {
    this.#isPointerDown = true;
    this.#gameObject.setTint(GRAY);
  }

  #handlePointerUp() {
    this.#gameObject.clearTint();
    if (!this.#isPointerDown) this.#gameObject.emit('click');
    this.#isPointerDown = false;
  }

  #handlePointerOut() {
    this.#gameObject.clearTint();
    this.#isPointerDown = false;
  }
}
