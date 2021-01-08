import { Physics } from 'Phaser';

export default class ChunkGroup extends Physics.Arcade.StaticGroup {
  constructor(
    scene,
    x, y,
    texture,
    chunkWidth, chunkHeight,
    groupWidth
  ) {
    super(scene.physics.world, scene);
    this.scene = scene;

    this.x = x;
    this.y = y;

    this.texture = texture;

    this.chunkWidth = chunkWidth;
    this.chunkHeight = chunkHeight;
    this.groupWidth = groupWidth;

    this.scrollFactorX = 1;
    this.scrollFactorY = 1;
    this.originX = 0.5;
    this.originY = 0.5;
    this.depth = 0;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  setScrollFactor(x, y) {
    this.scrollFactorX = x;
    this.scrollFactorY = y;
    this.children.each(chunk => chunk.setScrollFactor(x, y));
    return this;
  }

  setOrigin(x, y) {
    this.originX = x;
    this.originY = y;
    return super.setOrigin(x, y);
  }

  setDepth(depth) {
    this.depth = depth;
    return super.setDepth(depth);
  }

  spawn(deadline) {
    const spawnTo = deadline * this.scrollFactorX + this.groupWidth;
    while (this.x < spawnTo) {
      this.getFirstDead(true, this.x, this.y, this.texture)
        .setOrigin(this.originX, this.originY)
        .setScrollFactor(this.scrollFactorX, this.scrollFactorY)
        .setDepth(this.depth)
        .setActive(true)
        .setVisible(true)
        .refreshBody();
      this.x += this.chunkWidth;
    }
    return this;
  }

  kill(deadline) {
    const killTo = deadline * this.scrollFactorX - this.chunkWidth;
    this.children.each(chunk => {
      if (chunk.x < killTo) {
        chunk.setActive(false);
        chunk.setVisible(false);
      }
    });
    return this;
  }

  update(time, delta, deadline) {
    this.kill(deadline);
    this.spawn(deadline);
    return this;
  }





}
