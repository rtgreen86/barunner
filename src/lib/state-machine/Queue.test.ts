import {Queue} from './Queue';

describe('Queue', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = new Queue();
  });

  it('should run task immediately', () => {
    const task1 = jest.fn().mockName('Task1');
    queue.enqueue(task1);
    expect(task1).toHaveBeenCalled();
  });

  it('should enqueue second task and run one time after update', () => {
    const task2 = jest.fn().mockName('Task2');
    const task1 = jest.fn().mockName('Task1').mockImplementation(() => queue.enqueue(task2));
    queue.enqueue(task1);
    expect(task1).toHaveBeenCalled();
    expect(task2).not.toHaveBeenCalled();
    queue.update();
    expect(task2).toHaveBeenCalled();
    queue.update();
    expect(task2).toHaveBeenCalledTimes(1);
  });
});
