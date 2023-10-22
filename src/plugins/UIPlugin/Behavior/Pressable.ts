import * as Phaser from 'phaser';

const GRAY = 0x808080;

type GameObject = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Tint;

export class Pressable {
  private gameObject: GameObject;

  pressedTint = GRAY;

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;

    this.gameObject.on('pointerdown', this.handlePointerDown, this);
    this.gameObject.on('pointerup', this.handlePointerUp, this);
    this.gameObject.on('pointerout', this.handlePointerOut, this);
  }

  destroy() {
    this.gameObject.off('pointerdown', this.handlePointerDown, this);
    this.gameObject.off('pointerup', this.handlePointerUp, this);
    this.gameObject.off('pointerout', this.handlePointerOut, this);
  }

  private handlePointerDown() {
    this.gameObject.setTint(this.pressedTint);
  }

  private handlePointerUp() {
    this.gameObject.clearTint();
  }

  private handlePointerOut() {
    this.gameObject.clearTint();
  }
}