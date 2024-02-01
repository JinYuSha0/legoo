import {deferred} from './deferred';

export class TaskPool {
  constructor() {}

  private tasks = new Map<string, ReturnType<typeof deferred<any>>>();

  public notify(taskId: string, value: any) {
    const deferred = this.tasks.get(taskId);
    if (!deferred) return false;
    if (Object.hasOwnProperty.call(value, 'taskId')) {
      const {taskId, ...rest} = value;
      value = rest;
    }
    deferred.resolve(value);
    this.tasks.delete(taskId);
    return true;
  }

  public wait<T extends any>(taskId: string): Promise<T> {
    const task = deferred<T>();
    this.tasks.set(taskId, task);
    return task.promise;
  }
}
