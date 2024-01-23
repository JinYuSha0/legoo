import {Platform, PixelRatio, Dimensions} from 'react-native';
import {propertyRecord} from './const';

export enum Direction {
  width,
  height,
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
  rootValue?: number;
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

function isNumber(maybeNum: any): maybeNum is number {
  return !isNaN(+maybeNum);
}

export function init(props: Props) {
  if (props.platformExclude && props.platformExclude.includes(Platform.OS)) {
    return;
  }
  if (!props.direction || !props.designSize.height) {
    props.direction = Direction.width;
  }
  if (!props.rootValue) {
    props.rootValue = 16;
  }
  direction = props.direction;
  const pxRatio = PixelRatio.get();
  const {width, height} = Dimensions.get('window');
  const w = PixelRatio.getPixelSizeForLayoutSize(width);
  const h = PixelRatio.getPixelSizeForLayoutSize(height);
  wScale = 1 / pxRatio / (props.designSize.width / w);
  if (props.designSize.height) {
    hScale = 1 / pxRatio / (props.designSize.height / h);
  }
  if (Platform.OS === 'web') {
    if (props.direction === Direction.height) {
      document.documentElement.style.fontSize = `${hScale * props.rootValue}px`;
    } else {
      document.documentElement.style.fontSize = `${wScale * props.rootValue}px`;
    }
  }
}

export function px2u(
  uiElePx: number,
  propertyDirection?: PropertyDirection,
  auto?: boolean,
) {
  if (isNaN(+uiElePx)) return uiElePx;
  if (auto) {
    if (direction === Direction.height) {
      propertyDirection = PropertyDirection.y;
    } else {
      propertyDirection = PropertyDirection.x;
    }
  }
  if (propertyDirection === PropertyDirection.y) {
    return uiElePx * hScale;
  }
  return uiElePx * wScale;
}

export function ori(uiElePx: number) {
  return uiElePx;
}

export function getConfiguration() {
  return {
    wScale,
    hScale,
    direction,
  };
}

export function __css(parsed: NativeCssParsed) {
  for (const [className, style] of parsed.declarations) {
    try {
      const curr = style[0]?.[0].props[0][1][0];
      const [name, value] = curr ?? [];
      const direction = propertyRecord[name as keyof typeof propertyRecord];
      if (!name || direction == null || !isNumber(value)) continue;
      if (curr) curr[1] = px2u(value, direction, true);
    } catch (err) {}
  }
  return parsed;
}

export default {
  init,
  px2u,
  ori,
  getConfiguration,
  __css,
  Direction,
};
