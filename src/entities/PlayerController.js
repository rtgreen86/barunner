export default class PlayerController {
  constructor(scene) {
    this.scene = scene;
  }

  get isJumpDown() {
    return this.scene.cursor.space.isDown || this.scene.input.pointer1.isDown;
  }
}