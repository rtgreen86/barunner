export default class Controller {
  constructor(scene) {
    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = scene.input.keyboard.createCursorKeys();
    this.pointer = scene.input.pointer1;
  }
}
