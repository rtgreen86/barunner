import Phaser from 'Phaser';

export default class BackgroundLayer extends Phaser.GameObjects.Layer {
  constructor(scene, children) {
    super(scene, children);
    scene.add.existing(this);

    this.nextX = 0;
  }

  update(deadline) {
    super.update();
    let item = this.first;
    while (item) {
      if (item.x / item.scrollFactorX <= deadline - item.width) {
        item.setX(this.nextX);
        this.nextX += item.width;
      }
      item = this.next;
    }
  }
}



