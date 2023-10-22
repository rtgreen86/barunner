import * as Phaser from 'phaser';

export class Clickable {
  private gameObject: Phaser.GameObjects.GameObject;

  private isPointerDown: boolean;

  constructor(gameObject: Phaser.GameObjects.GameObject) {
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
    this.isPointerDown = true;
  }

  private handlePointerUp() {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.gameObject.emit('click');
  }

  private handlePointerOut() {
    this.isPointerDown = false;
  }
}
