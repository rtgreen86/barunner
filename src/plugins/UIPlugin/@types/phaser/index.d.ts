declare namespace Phaser.GameObjects {
  interface Button extends Image {
    click: () => void
  }

  interface GameObjectFactory {
    button(
      x: number,
      y: number,
      texture: string,
      frame: number
    ): Button
  }
}