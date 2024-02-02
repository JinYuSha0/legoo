import {isArray} from '../common';

export function variableToHsla(variables: any) {
  if (isArray(variables)) {
    if (variables.length === 3) {
      return `hsl(${variables.join(' ')})`;
    } else if (variables.length === 4) {
      return `hsla(${variables.slice(0, 3).join(' ')} / ${variables[3]})`;
    }
  }
  return variables;
}
