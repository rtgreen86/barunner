import Phaser from "phaser";

export default class UIButton extends Phaser.GameObjects.Image {
  #isPointerDown = false;

  constructor(scene, x, y) {
    super(scene, x, y, 'button-x');

    this.setInteractive({
      cursor: 'pointer'
    });

    this.on('pointerdown', this.#handlePointerDown, this);
    this.on('pointerup', this.#handlePointerUp, this);
    this.on('pointerout', this.#handlePointerOut);
  }

  #handlePointerDown() {
    console.log('pointerdown');
    this.#isPointerDown = true;
  }

  #handlePointerUp(pointer, x, y) {
    console.log('pointerup');
    if (this.#isPointerDown) {
      console.log('emit click');
      this.emit('uibuttonclick', this, pointer, x, y);
    }
  }

  #handlePointerOut() {
    this.#isPointerDown = false;
  }
}
