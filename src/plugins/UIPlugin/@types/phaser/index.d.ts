declare namespace Phaser.GameObjects {
  interface BaMenuItem extends Text { }

  interface Button extends Image { }

  interface GameObjectFactory {
    button(x: number, y: number, texture: string, frame: number): Button
    baMenuItem(x: number, y: number, text: string | string[], style: Phaser.Types.GameObjects.Text.TextStyle): BaMenuItem
  }
}