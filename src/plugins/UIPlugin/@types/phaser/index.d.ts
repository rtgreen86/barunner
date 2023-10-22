declare namespace Phaser.GameObjects {
  interface BaClickable {
    click: () => this;
    onClick: (fn: Function, context: any) => this;
  }

  interface BaMenuItem extends BaClickable, Text {

  }

  interface Button extends Image {
    click: () => void
  }

  interface GameObjectFactory {
    button(x: number, y: number, texture: string, frame: number): Button
    baMenuItem(x: number, y: number, text: string | string[], style: Phaser.Types.GameObjects.Text.TextStyle): BaMenuItem
  }
}