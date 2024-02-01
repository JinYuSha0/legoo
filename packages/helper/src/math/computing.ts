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
  return recursion(method, value, ...args);
}

function factory(method: Method) {
  return (...args: Numeric[]) => {
    if (args.length === 0) return 0;
    if (args.length === 1) return args[0];
    return recursion(method, null, ...args);
  };
}

function isInterage(x: Numeric) {
  return new Decimal(x).isInteger();
}

function toFixd(x: Numeric, dp?: number, rm?: number) {
  return new Decimal(x).toFixed(dp, rm);
}

function equal(x: Numeric, y: Numeric) {
  return new Decimal(x).equals(y);
}

function lessThan(x: Numeric, y: Numeric) {
  return new Decimal(x).lessThan(y);
}

function greaterThan(x: Numeric, y: Numeric) {
  return new Decimal(x).greaterThan(y);
}

function lessThanOrEqualTo(x: Numeric, y: Numeric) {
  return new Decimal(x).lessThanOrEqualTo(y);
}

function greaterThanOrEqualTo(x: Numeric, y: Numeric) {
  return new Decimal(x).greaterThanOrEqualTo(y);
}

export const computing = {
  add: factory('add'),
  sub: factory('sub'),
  mul: factory('mul'),
  div: factory('div'),
  isInterage,
  toFixd,
  equal,
  lessThan,
  greaterThan,
  lessThanOrEqualTo,
  greaterThanOrEqualTo,
};
