import {toSafeNumber} from './toSafeNumber';
import Decimal, {type Numeric} from 'decimal.js-light';

type Method = keyof PickMatchedProperty<Decimal, (y: Numeric) => Decimal>;

function computingExecute(method: Method) {
  return function (x: Numeric, y: Numeric) {
    const _x = new Decimal(toSafeNumber(x));
    const _y = new Decimal(toSafeNumber(y));
    // @ts-ignore
    return _x[method](_y).toFixed();
  };
}

function recursion(
  method: Method,
  prevValue: Numeric | null,
  ...args: Numeric[]
) {
  const value: Numeric = computingExecute(method).apply(
    null,
    prevValue === null ? args.splice(0, 2) : [prevValue, args.splice(0, 1)[0]],
  );
  if (args.length === 0) return value;
  return recursion(method, prevValue, ...args);
}

function factory(method: Method) {
  return (...args: Numeric[]) => {
    if (args.length === 0) return 0;
    if (args.length === 1) return args[0];
    return recursion(method, null, ...args);
  };
}

function equal(x: Numeric, y: Numeric) {
  const result = computingExecute('sub')(x, y);
  if (result === '0') return true;
  return false;
}

function lessThan(x: Numeric, y: Numeric) {
  const result = computingExecute('sub')(x, y);
  if (result.startsWith('-')) return true;
  return false;
}

function moreThan(x: Numeric, y: Numeric) {
  if (!lessThan(x, y) && !equal(x, y)) return true;
  return false;
}

function lessThanOrEqual(x: Numeric, y: Numeric) {
  return lessThan(x, y) || equal(x, y);
}

function moreThanOrEqual(x: Numeric, y: Numeric) {
  return !lessThan(x, y);
}

export const computing = {
  add: factory('add'),
  sub: factory('sub'),
  mul: factory('mul'),
  div: factory('div'),
  equal,
  lessThan,
  moreThan,
  lessThanOrEqual,
  moreThanOrEqual,
};
