import Phaser from "phaser";

export default class UIButton extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'button-x');
  }
}
