import {Platform, PixelRatio, Dimensions} from 'react-native';

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

let wScale: number = 1;
let hScale: number = 1;
let direction: Direction = Direction.width;

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

export default {
  init,
  px2u,
  ori,
  Direction,
};
