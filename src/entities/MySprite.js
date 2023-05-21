import Phaser from 'phaser';

class MySprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'button-x');
  }

  changeColor() {
    this.tint = 0xff0000;
  }
}

Phaser.GameObjects.GameObjectFactory.register('mySprite', function (x, y) {
  const spr = new MySprite(this.scene, x, y);

  this.displayList.add(spr)
  this.updateList.add(spr)

  return spr;
})