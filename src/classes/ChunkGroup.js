import { Physics } from 'Phaser';
import ChunkManager from './ChunkManager';

export default class ChankGroup extends Physics.Arcade.StaticGroup {
  constructor(
    scene,
    x, y,
    texture, width, height,
    length
  ) {
    super(scene.physics.world, scene);

    this.scene = scene;
    this.texture = texture;

    this.chunkManager = new ChunkManager(this, x, y, width, height, length);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  createChunk(x, y) {
    this.add(this.scene.physics.add.staticImage(x, y, this.texture));
  }

  update() {
    this.chunkManager.update(this.scene.cameras.main);
  }

  resurrectChunk(chunk) {
    chunk.setActive(true);
    chunk.setVisible(true);
    chunk.refreshBody();
  }

  killChunk(chunk) {
    chunk.setActive(false);
    chunk.setVisible(false);
  }

  setScrollFactor(x, y) {
    this.chunkManager.setScrollFactor(x, y);
    const chunks = this.getChildren();
    for (let i = 0; i < chunks.length; i++) {
      chunks[i].setScrollFactor(x, y);
    }
  }
}
