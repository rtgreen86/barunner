export default class PlayerController {
  constructor(scene) {
    this.scene = scene;
    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.pointer = this.scene.input.pointer1;
  }

  get isJumpDown() {
    return this.cursor.space.isDown || this.pointer.isDown;
  }
}