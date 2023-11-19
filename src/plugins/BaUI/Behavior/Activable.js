export default class Activable {
  #gameObject

  constructor(gameObject) {
    this.#gameObject = gameObject;

    this.#gameObject.on('pointerover', this.#handlePointerOver, this);
    this.#gameObject.on('pointerdonw', this.#handlePointerDown, this);
  }

  destroy() {
    this.#gameObject.off('pointerover', this.#handlePointerOver, this);
    this.#gameObject.off('pointerdown', this.#handlePointerDown, this);
  }

  #handlePointerOver() {
    this.#gameObject.emit('activating', this.#gameObject);
  }

  #handlePointerDown() {
    this.#gameObject.emit('activating', this.#gameObject);
  }
}
