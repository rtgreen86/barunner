import { Physics } from 'Phaser';

export default class ChankGroup extends Physics.Arcade.StaticGroup {
  constructor(
    scene,
    x, y,
    texture, width, height,
    length
  ) {
    super(scene.physics.world, scene);

    this.scrollFactorX = 1;
    this.scrollFactorY = 1;

    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.x = x;
    this.y = y;
    this.texture = texture;
    this.width = width;
    this.height = height;
    this.length = length;

    this.initChunks();
  }

  initChunks() {
    for (let i = 0; i < this.length; i++) {
      this.add(this.scene.physics.add.staticImage(this.x, this.y, this.texture));
      this.x += this.width;
    }
  }

  update() {
    this.killChunks();
    this.resurrectChunks();
  }

  resurrectChunks() {
    let chunk = this.getFirstDead(false, this.x, this.y);
    while (chunk) {
      this.x += this.width;
      chunk.setActive(true);
      chunk.setVisible(true);
      chunk.refreshBody();
      chunk = this.getFirstDead(false, this.x, this.y);
    }
  }

  killChunks() {
    const chunks = this.getChildren();
    const deadline = this.scene.deadline * this.scrollFactorX;
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i].x < deadline) {
        chunks[i].setActive(false);
        chunks[i].setVisible(false);
      }
    }
  }

  setScrollFactor(x, y) {
    this.scrollFactorX = x;
    this.scrollFactorY = y;
    const chunks = this.getChildren();
    for (let i = 0; i < chunks.length; i++) {
      chunks[i].setScrollFactor(x, y);
    }
  }
}
