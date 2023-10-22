import { GameObjects, Input } from 'phaser';
import { Clickable, Pressable } from '../Behavior';

const WHITE = 0xffffff;

export class Button extends GameObjects.Image implements GameObjects.Button {
  private enterKey:  Input.Keyboard.Key

  private clickable: Clickable;

  private pressable: Pressable;

  isFocused = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number) {
    super(scene, x, y, texture, frame);

    this.setInteractive({
      cursor: 'pointer',
      pixelPerfect: true
    });

    this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, false, false);

    this.clickable = new Clickable(this);
    this.pressable = new Pressable(this);

    this.enterKey.on('down', this.handleEnterDown, this);
  }

  destroy() {
    this.clickable.destroy();
    this.pressable.destroy();
    this.enterKey.off('down', this.handleEnterDown, this);
    super.destroy();
  }

  buttonUp() {
    this.setTint(WHITE);
  }

  private handleEnterDown(key: Phaser.Input.Keyboard.Key, event:	KeyboardEvent) {
    if (!this.isFocused) {
      return;
    }
    this.click();
  }

  click() {
    // this.handlePointerDown();
    // this.handlePointerUp();
  }
}

export default Button;
