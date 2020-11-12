export default class ChankManager {
  constructor(
    group,
    x, y, width, height,
    length
  ) {
    this.group = group;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.scrollFactorX = 1;
    this.scrollFactorY = 1;

    for (let i = 0; i < length; i++) {
      this.group.createChunk(this.x, this.y);
      this.x += this.width;
    }
  }

  updateDeadline(camera) {
    this.deadline = camera.scrollX * this.scrollFactorX - this.width;
  }

  update(camera) {
    this.updateDeadline(camera);
    this.killChunks();
    this.resurrectChunks();
  }

  resurrectChunks() {
    let chunk = this.group.getFirstDead(false, this.x, this.y);
    while (chunk) {
      this.x += this.width;
      this.group.resurrectChunk(chunk);
      chunk = this.group.getFirstDead(false, this.x, this.y);
    }
  }

  killChunks() {
    const chunks = this.group.getChildren();
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i].x < this.deadline) {
        this.group.killChunk(chunks[i]);
      }
    }
  }

  setScrollFactor(x, y) {
    this.scrollFactorX = x;
    this.scrollFactorY = y;
  }
}
