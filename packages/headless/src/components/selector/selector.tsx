import {View} from 'react-native';
import {isNil} from '@legoo/helper';
import {DoubleLinkList} from '@legoo/helper';
import {useEvent} from '@legoo/hooks';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  runOnUI,
  withDecay,
} from 'react-native-reanimated';
import ItemComponent, {IItemProps} from './item';
import IndicatorComponent, {IIndicatorProps} from './indicator';

export type IItem = {
  label: string;
  value: any;
};

export interface ISelectorProps {
  data: IItem[];
  visibleItemCount: number;
  width?: number;
  height?: number;
  initialIndex?: number;
  itemHeight?: number;
  containerHeight?: number;
  extraRenderItem?: number;
  renderThreshold?: number;
  debug?: boolean;
  maxVelocity?: number;
  Item?: (props: IItemProps) => React.ReactNode;
  Indicator?: (props: IIndicatorProps) => React.ReactNode;
}

type WrapItem = {
  top: number;
  wrapped: IItem;
};

const Selector: ForwardRefRenderFunction<Reanimated.View, ISelectorProps> = (
  props,
  ref,
) => {
  const {
    data,
    visibleItemCount,
    width = 100,
    height,
    initialIndex = 0,
    itemHeight = 30,
    containerHeight = 2001 * itemHeight,
    extraRenderItem = 2 * visibleItemCount,
    renderThreshold = Math.ceil(extraRenderItem / 2) * itemHeight,
    debug = false,
    maxVelocity = Number.MAX_SAFE_INTEGER,
    Item = ItemComponent,
    Indicator = IndicatorComponent,
  } = props;
  const len = useMemo(() => data.length, [data.length]);
  const _visibleItemCount = useMemo(() => {
    if (visibleItemCount > len) {
      console.warn('visibleItemCount exceeds length');
      return len;
    }
    return visibleItemCount;
  }, [visibleItemCount, len]);
  const _initialIndex = useMemo(() => {
    if (initialIndex >= len || initialIndex < 0) {
      console.warn('initialIndex out of bounds');
      return 0;
    }
    return initialIndex;
  }, [initialIndex, len]);
  const visibleHeight = useMemo(
    () => _visibleItemCount * itemHeight,
    [_visibleItemCount, itemHeight],
  );
  const _height = useMemo(
    () => height ?? itemHeight * _visibleItemCount,
    [height, itemHeight, _visibleItemCount],
  );
  const halfItemOffset = useMemo(
    () => (visibleItemCount % 2 === 0 ? itemHeight / 2 : 0),
    [visibleItemCount, itemHeight],
  );
  const initialOffsetY = useMemo(
    () => -(containerHeight - _visibleItemCount * itemHeight) / 2,
    [],
  );
  const computeRenderRange = useCallback(
    (offsetY: number) => {
      const renderRange = [
        offsetY + extraRenderItem * itemHeight - halfItemOffset,
        offsetY -
          (visibleItemCount + extraRenderItem) * itemHeight -
          halfItemOffset,
      ];
      return renderRange as [number, number];
    },
    [itemHeight, extraRenderItem, renderThreshold, halfItemOffset],
  );
  const computeRenderBoundray = useCallback(
    (offsetY: number) => {
      const [start, end] = computeRenderRange(offsetY);
      const renderBoundray = [start - renderThreshold, end + renderThreshold];
      return renderBoundray as [number, number];
    },
    [computeRenderRange, renderThreshold],
  );
  const renderRange = useRef<[number, number]>(
    computeRenderRange(initialOffsetY),
  );
  const renderBoundary = useRef<[number, number]>(
    computeRenderBoundray(initialOffsetY),
  );
  const cycliData = useMemo(() => {
    let startTime = 0;

    if (debug) {
      startTime = performance.now();
    }

    const link = DoubleLinkList(data, true);

    if (debug) {
      console.debug(
        `Doubly linked list generated in: ${performance.now() - startTime}ms`,
      );
    }

    return link;
  }, [data]);
  const generateRenderList = useCallback(
    (baseIndex: number, renderRange: [number, number]) => {
      let startTime = 0;

      if (debug) {
        startTime = performance.now();
      }

      const result: WrapItem[] = [];
      const [_, map] = cycliData;
      const baseNode = map.get(baseIndex);

      const count = visibleItemCount + 2 * extraRenderItem;
      const topLen = extraRenderItem + Math.ceil(visibleItemCount / 2);

      let startOffset = renderRange[0] - (topLen - 1) * itemHeight;
      let head = baseNode;
      for (let i = 0; i < topLen; i++) {
        if (head?.value) {
          result.unshift({
            top: startOffset,
            wrapped: head?.value,
          });
          head = head.prev;
          startOffset += itemHeight;
        } else {
          break;
        }
      }

      startOffset -= (topLen + 1) * itemHeight;
      let tail = baseNode?.next;
      const bottomLen = count - topLen;
      for (let i = 0; i < bottomLen; i++) {
        if (!isNil(tail?.value)) {
          result.push({
            top: startOffset,
            wrapped: tail?.value,
          });
          tail = tail?.next;
          startOffset -= itemHeight;
        } else {
          break;
        }
      }

      if (debug) {
        console.debug(
          `Render List generated in: ${performance.now() - startTime}ms`,
        );
      }

      return result;
    },
    [cycliData, extraRenderItem, debug],
  );
  const initialData = useMemo(
    () => generateRenderList(_initialIndex, renderRange.current),
    [_initialIndex],
  );
  const [innerData, setInnerData] = useState(initialData);
  const lazyRender = useEvent((offsetY: number) => {
    'worklet';
    const [startBoundary, endBoundary] = renderBoundary.current;
    if (!(offsetY >= startBoundary || offsetY - visibleHeight <= endBoundary))
      return;

    if (offsetY >= startBoundary) offsetY = startBoundary;
    if (offsetY - visibleHeight <= endBoundary)
      offsetY = endBoundary + visibleHeight;
    if (halfItemOffset > 0) offsetY -= halfItemOffset;

    const offsetIdx =
      ((offsetY - initialOffsetY) / itemHeight - initialIndex) % len;
    let baseIdx = 0;
    if (offsetIdx > 0) {
      baseIdx = len - offsetIdx;
    } else {
      baseIdx = Math.abs(offsetIdx);
    }

    if (debug) {
      console.debug(
        `offsetY: ${offsetY}, offsetIdx: ${offsetIdx}, baseIdx: ${baseIdx}`,
      );
    }

    renderRange.current = computeRenderRange(offsetY);
    renderBoundary.current = computeRenderBoundray(offsetY);

    setInnerData(generateRenderList(baseIdx, renderRange.current));
  });
  const offset = useSharedValue(initialOffsetY);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));
  const pan = Gesture.Pan()
    .onChange(event => {
      offset.value += event.changeY;
    })
    .onFinalize(event => {
      const maxAbsVelocity = Math.min(Math.abs(event.velocityY), maxVelocity);
      offset.value = withDecay({
        velocity: event.velocityY < 0 ? -maxAbsVelocity : maxAbsVelocity,
        rubberBandEffect: true,
        clamp: [-containerHeight - halfItemOffset, 0 - halfItemOffset],
      });
    });
  useEffect(() => {
    const id = 1;
    runOnUI(() => {
      offset.addListener(id, value => {
        runOnJS(lazyRender)(value);
      });
    })();
    return () => {
      runOnUI(() => {
        offset.removeListener(id);
      })();
    };
  }, []);
  return (
    <View className="relative">
      <View
        style={{
          height: _height,
          width: width,
          overflow: 'hidden',
        }}>
        <GestureDetector gesture={pan}>
          <Reanimated.View ref={ref} style={[animatedStyles]}>
            <View className="relative" style={{height: containerHeight}}>
              {debug && (
                <>
                  <View
                    className="absolute w-full bg-orange-700"
                    style={{
                      top: -renderBoundary.current[0],
                      height: itemHeight,
                    }}
                  />
                  <View
                    className="absolute w-full bg-orange-700"
                    style={{
                      top: -renderBoundary.current[1],
                      height: itemHeight,
                    }}
                  />
                </>
              )}
              {innerData.map((item, index) => (
                <Item
                  key={`${item.wrapped.value}_${index}`}
                  top={-item.top}
                  itemHeight={itemHeight}
                  label={item.wrapped.label}
                />
              ))}
            </View>
          </Reanimated.View>
        </GestureDetector>
      </View>
      <View className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none">
        <View className="flex flex-1 justify-center items-center z-10">
          <Indicator itemHeight={itemHeight} />
        </View>
      </View>
    </View>
  );
};

export default memo(forwardRef(Selector));
