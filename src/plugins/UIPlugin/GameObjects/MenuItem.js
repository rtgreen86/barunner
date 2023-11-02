import * as Phaser from 'phaser';

export default class MenuItem extends Phaser.GameObjects.Text {
  #isPointerDown = false;

  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);
    this.setOrigin(0.5);
    this.setInteractive({cursor: 'pointer'});
  }

  destroy(fromScene) {
    super.destroy(fromScene);
  }

  #handlePointerDown() {
    this.#isPointerDown = true;
  }

  #handlePointerUp() {
    if (!this.#isPointerDown) return;
    this.#isPointerDown = false;
    this.emit('click');
  }

  #handlePointerOut() {
    this.#isPointerDown = false;
  }
}
