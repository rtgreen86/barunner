export default class Controller {
  constructor(scene) {
    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = scene.input.keyboard.createCursorKeys();
    this.pointer = scene.input.pointer1;
    this.mouse = scene.input.activePointer;
  }

  get isActionDown() {
    return this.cursor.space.isDown || this.pointer.isDown || this.mouse.isDown;
  }

  getActionDuration() {
    if (this.cursor.space.isDown) {
      return this.cursor.space.getDuration();
    }
    if (this.pointer.isDown) {
      return this.pointer.getDuration();
    }
    if (this.mouse.isDown) {
      return this.mouse.getDuration();
    }
    return 0;
  }
}