type TAnyFunc<P extends any[] = any[], T extends any = any> = (...args: P) => T;

type PickMatchedProperty<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type ValueOf<T> = T[keyof T];
