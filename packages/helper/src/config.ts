import Decimal from 'decimal.js-light';

export let Config = {
  MAX_DEFAULT_PRECISION: 9,
  DEFAULT_SAFE_VALUE: 0,
  THOUSANDTHS_SEPARATOR: ',',
};

export function setConfig(newConfig: typeof Config) {
  Config = newConfig;
  Decimal.set({
    precision: newConfig.MAX_DEFAULT_PRECISION,
  });
}

setConfig(Config);
