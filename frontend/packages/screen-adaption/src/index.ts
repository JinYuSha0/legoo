import {Platform, PixelRatio, Dimensions} from 'react-native';
import {propertyRecord} from './const';

export enum Direction {
  width,
  height,
  auto,
}

export enum PropertyDirection {
  x,
  y,
}

export type DesignSize = {
  width: number;
  height?: number;
};

export type Props = {
  designSize: DesignSize;
  direction?: Direction;
  platformExclude?: Platform['OS'][];
};

export type NativeCssParsed = {
  declarations: [
    string,
    {
      0?: {
        specificity: {
          A: number;
          B: number;
          C: number;
          I: number;
          S: number;
          O: number;
        };
        scope: number;
        props: ['style', [string, string | number][]][];
      }[];
      scope: number;
    },
  ][];
};

let wScale: number = 1;
let hScale: number = 1;
let direction: Direction = Direction.width;

function isNumber(maybeNum): maybeNum is number {
  return !isNaN(+maybeNum);
}

export function init(props: Props) {
  if (props.platformExclude && props.platformExclude.includes(Platform.OS)) {
    return;
  }
  if (!props.direction || !props.designSize.height) {
    props.direction = Direction.width;
  }
  direction = props.direction;
  const pxRatio = PixelRatio.get();
  const {width, height} = Dimensions.get('window');
  const w = PixelRatio.getPixelSizeForLayoutSize(width);
  const h = PixelRatio.getPixelSizeForLayoutSize(height);
  wScale = 1 / pxRatio / (props.designSize.width / w);
  if (props.direction !== Direction.width && props.designSize.height) {
    hScale = 1 / pxRatio / (props.designSize.height / h);
  }
}

export function px2u(uiElePx: number, propertyDirection?: PropertyDirection) {
  if (isNaN(+uiElePx)) return uiElePx;
  if (
    propertyDirection === PropertyDirection.y &&
    direction !== Direction.width
  ) {
    return uiElePx * hScale;
  }
  return uiElePx * wScale;
}

export function ori(uiElePx: number) {
  return uiElePx;
}

export function __css(parsed: NativeCssParsed) {
  for (const [className, style] of parsed.declarations) {
    try {
      const curr = style[0]?.[0].props[0][1][0];
      const [name, value] = curr ?? [];
      const direction = propertyRecord[name];
      if (!name || direction == null || !isNumber(value)) continue;
      curr[1] = px2u(value, direction);
    } catch (err) {}
  }
  return parsed;
}

export default {
  init,
  px2u,
  ori,
  __css,
  Direction,
};
