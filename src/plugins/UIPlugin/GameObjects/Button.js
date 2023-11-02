import * as Phaser from 'phaser';

const GRAY = 0x808080;

export class Button extends Phaser.GameObjects.Image {
  #isPointerDown = false;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.setInteractive({
      cursor: 'pointer',
      pixelPerfect: true
    });

    // this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false);
    // this.enterKey.on('down', this.handleEnterDown, this);

    this.on('pointerdown', this.#handlePointerDown, this);
    this.on('pointerup', this.#handlePointerUp, this);
    this.on('pointerout', this.#handlePointerOut, this);
  }

  destroy(fromScene) {
    super.destroy(fromScene);
    this.off('pointerdown', this.#handlePointerDown, this);
    this.off('pointerup', this.#handlePointerUp, this);
    this.off('pointerout', this.#handlePointerOut, this);
  }

  #handlePointerDown() {
    this.#isPointerDown = true;
    this.setTint(GRAY);
  }

  #handlePointerUp() {
    this.clearTint();
    if (!this.#isPointerDown) return;
    this.#isPointerDown = false;
    this.emit('click');
  }

  #handlePointerOut() {
    this.clearTint();
    this.#isPointerDown = false;
  }
}

export default Button;
