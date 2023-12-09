import Phaser from 'phaser';
import { OpenMainMenu } from '../commands';

export default class VirtualGamepadScene extends Phaser.Scene {
  constructor() {
    super('virtual-gamepad-scene');

    this.isPointerDown = false;
    this.isGameobjectOver = false;
  }

  get isActivePointerdown() {
    return !this.isGameobjectOver && this.input.activePointer.isDown;
  }

  create() {
    this.xButton = this.createXButton();
    this.input.on('gameobjectover', this.handleGameobjectOver, this);
    this.input.on('gameobjectout', this.handleGameobjectOut, this);
    this.xButton.on('click', this.handleXClick, this);
  }


  createXButton() {
    const texture = this.textures.get('button-x').get();
    const scale = 0.5;
    const x = 1280 - texture.width * scale / 2;
    const y = texture.height * scale / 2;
    return this.add.baButton(x, y, 'button-x', 0).setScale(scale);
  }

  update(time, delta) {
    const isOverGameObject = this.input.hitTestPointer(this.input.activePointer).length !== 0;
    const isDown = !isOverGameObject && this.input.activePointer.isDown;
    const gameScene = this.scene.get('GameScene');
    const player = gameScene.children.getByName('The Player');
    player.touch(isDown, time, delta);

    if (this.isActivePointerdown) {
      console.log('down');
    }
  }

  handleGameobjectOver() {
    this.isGameobjectOver = true;
  }

  handleGameobjectOut() {
    this.isGameobjectOver = false;
  }

  handleXClick() {
    new OpenMainMenu(this.scene).execute();
  }
}
