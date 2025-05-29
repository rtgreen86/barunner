type Task = () => unknown;

export class Queue<T extends Task = Task> {
  private isBusy = false;

  private queue: T[] = [];

  enqueue(task: T) {
    if (this.isBusy) {
      this.queue.push(task);
      return this;
    }
    this.run(task);
    return this;
  }

  update() {
    if (!this.isBusy && this.queue.length > 0) {
      this.run(this.queue.shift()!);
    }
    return this;
  }

  private run(task: T) {
    this.isBusy = true;
    task();
    this.isBusy = false;
  }
}
