import { Physics } from 'Phaser';

export default class ChunkGroup extends Physics.Arcade.StaticGroup {
  constructor(
    scene,
    x, y,
    texture, width, height,
    length
  ) {
    super(scene.physics.world, scene);
    this.scene = scene;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.scrollFactorX = 1;
    this.scrollFactorY = 1;

    this.camera = this.scene.cameras.main;

    this.createCunks(texture, length);
    this.updateDeadline();
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  createCunks(texture, length) {
    for (let i = 0; i < length; i++) {
      this.add(this.scene.physics.add.staticImage(this.x, this.y, texture));
      this.x += this.width;
    }
  }

  updateDeadline() {
    this.deadline = this.camera.scrollX * this.scrollFactorX - this.width;
  }

  update() {
    this.updateDeadline();

    // kill
    const chunksToKill = this.getChildren();
    for (let i = 0; i < chunksToKill.length; i++) {
      if (chunksToKill[i].x < this.deadline) {
        chunksToKill[i].setActive(false);
        chunksToKill[i].setVisible(false);
      }
    }

    // resurrect
    let chunk = this.getFirstDead(false, this.x, this.y);
    while (chunk) {
      this.x += this.width;
      chunk.setActive(true);
      chunk.setVisible(true);
      chunk.refreshBody();
      chunk = this.getFirstDead(false, this.x, this.y);
    }

    return this;
  }


  setScrollFactor(x, y) {
    this.scrollFactorX = x;
    this.scrollFactorY = y;
    this.getChildren().forEach(chunk => chunk.setScrollFactor(x, y));
    return this;
  }

  setOrigin(x, y) {
    this.getChildren().forEach(chunk => chunk.setOrigin(x, y));
    return this;
  }
}
