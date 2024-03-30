import EventEmitter from 'eventemitter3';
import * as limu from 'limu';

type ObserverEvent = 'change';

export class Observable<T extends object> extends EventEmitter<ObserverEvent> {
  constructor(initialValue: T) {
    super();
    this.val = initialValue;
  }

  val: T;

  emit(event: ObserverEvent, newValue: T): boolean {
    this.val = newValue;
    return super.emit(event, newValue);
  }

  setValue(newValue: T | ((newValue: T) => void)) {
    let final;
    if (typeof newValue === 'function') {
      const draft = limu.createDraft(this.val);
      newValue(draft);
      final = limu.finishDraft(draft);
    } else {
      final = limu.deepCopy(newValue);
    }
    this.emit('change', final);
  }
}

export const Observer = <T extends object>(
  initialValue: T,
): [Observable<T>, (newValue: T | ((newValue: T) => void)) => void] => {
  const observable = new Observable(initialValue);
  return [observable, observable.setValue.bind(observable)];
};
