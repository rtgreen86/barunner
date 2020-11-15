import ChunkGroup from './ChunkGroup';

export default class TiledChunkGroup extends ChunkGroup {
  constructor(
    scene,
    x, y,
    texture, width, height,
    length,
    framesCount
  ) {
    super(scene, x, y, texture, width, height, length);
    this.framesCount = framesCount;
  }

  createChunk(x, y) {
    if (!this.nextFrame) {
      this.nextFrame = 0;
    }
    this.add(this.scene.physics.add.staticImage(x, y, this.texture, this.nextFrame));
    if (++this.nextFrame >= this.framesCount) this.nextFrame = 0;
  }
}