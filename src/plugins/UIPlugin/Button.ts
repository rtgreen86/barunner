import { GameObjects, Input } from 'phaser';

const WHITE = 0xffffff;
const GRAY = 0x808080;


export default class Button extends GameObjects.Image {
  private isPointerDown = false;

  private enterKey:  Input.Keyboard.Key

  isFocused = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number) {
    super(scene, x, y, texture, frame);

    this.setInteractive({
      cursor: 'pointer',
      pixelPerfect: true
    });

    this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false);

    this.on('pointerdown', this.handlePointerDown, this);
    this.on('pointerup', this.handlePointerUp, this);
    this.on('pointerout', this.handlePointerOut, this);
    this.enterKey.on('down', this.handleEnterDown, this);
    this.enterKey.on('up', this.handleEnterUp, this);
  }

  destroy() {
    this.off('pointerdown', this.handlePointerDown, this);
    this.off('pointerup', this.handlePointerUp, this);
    this.off('pointerout', this.handlePointerOut, this);
    super.destroy();
  }

  private handlePointerDown() {
    this.isPointerDown = true;
    this.setTint(GRAY);
  }

  private handlePointerUp() {
    if (this.isPointerDown) {
      Promise.resolve().then(() => this.emit('click', this))
    }
    this.setTint(WHITE);
    this.isPointerDown = false;
  }

  private handlePointerOut() {
    this.isPointerDown = false;
    this.setTint(WHITE);
  }

  private handleEnterDown(key: Phaser.Input.Keyboard.Key, event:	KeyboardEvent) {
    console.log('handleEnterDown', this.isFocused, this.isPointerDown);

    if (!this.isFocused || this.isPointerDown) {
      return;
    }
    console.log('handleEnterDown 1');

    this.handlePointerDown();
    Promise.resolve().then(() => this.emit('click', this));
  }

  private handleEnterUp() {
    this.isPointerDown = false;
    this.setTint(WHITE);
  }
}