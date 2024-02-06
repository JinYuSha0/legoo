import {View} from 'react-native';
import {isNil} from '@legoo/helper';
import {DoubleLinkList} from '@legoo/helper';
import {useEvent} from '@legoo/hooks';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import React, {
  type ForwardRefRenderFunction,
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
  withSpring,
} from 'react-native-reanimated';
import DefaultItemComponent, {type IItemProps} from './item';
import DefaultIndicatorComponent, {type IIndicatorProps} from './indicator';

export type IItem<T = any> = {
  label: string;
  value: T;
};

export interface ISelectorProps<T = any> {
  /**
   * Data array
   */
  data: IItem<T>[];
  /**
   * Selector height
   */
  height: number;
  /**
   * Initial selected index
   * default: 0
   */
  initialIndex?: number;
  /**
   * Render Item height
   * default: 30
   */
  itemHeight?: number;
  /**
   * Scroll container height
   * this value determines the maximum scroll distance you can scroll in both directions.
   * default: 30 * 2001
   */
  containerHeight?: number;
  /**
   * Render an extra number of items outside the visible range
   * if a white screen appears when you scroll quickly, you can try increasing this value.
   * if the value is particularly large, it may cause the rendering speed to slow down.
   * deafult: Three times the number of items in the visible range
   */
  extraRenderItem?: number;
  /**
   * This value determines how many items remain from the boundary to start the next round of lazy rendering.
   * if a white screen appears when you scroll quickly, you can try decreasing this value.
   * if the value is particularly small, it may cause the unnecessary rendering.
   * default: Math.ceil(extraRenderItem / 2)
   */
  renderThreshold?: number;
  /**
   * Debug mode
   */
  debug?: boolean;
  /**
   * Maximum scroll velocity
   * if the velocity is too high, it will easily cause a white screen.
   * limit the velocity to reduce unnecessary rendering.
   */
  maxVelocity?: number;
  /**
   * Item component
   * it is recommended to use the React.memo package to improve performance
   */
  ItemComponent?: (props: IItemProps) => React.ReactNode;
  /**
   * Indicator Component
   */
  IndicatorComponent?: (props: IIndicatorProps) => React.ReactNode;
  /**
   * A callback triggered when the selection changes.
   * the first parameter is the selected value,
   * and the second parameter is the index of the selection in the data array.
   */
  onChange?: (value: T, index: number) => void;
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
    height,
    initialIndex = 0,
    itemHeight = 30,
    containerHeight = 2001 * itemHeight,
    extraRenderItem,
    renderThreshold,
    debug = false,
    maxVelocity = Number.MAX_SAFE_INTEGER,
    ItemComponent = DefaultItemComponent,
    IndicatorComponent = DefaultIndicatorComponent,
    onChange,
  } = props;
  const len = useMemo(() => data.length, [data.length]);
  const _initialIndex = useMemo(() => {
    if (initialIndex >= len || initialIndex < 0) {
      console.warn('initialIndex out of bounds');
      return initialIndex % len;
    }
    return initialIndex;
  }, [initialIndex, len]);
  const visibleItemCount = useMemo(
    () => Math.floor(height / itemHeight),
    [height, itemHeight],
  );
  const _extraRenderItem = useMemo(
    () => extraRenderItem ?? 3 * visibleItemCount,
    [extraRenderItem, visibleItemCount],
  );
  const _renderThreshold = useMemo(
    () => (renderThreshold ?? Math.ceil(_extraRenderItem / 2)) * itemHeight,
    [renderThreshold, _extraRenderItem, itemHeight],
  );
  const visibleHeight = useMemo(
    () => visibleItemCount * itemHeight,
    [visibleItemCount, itemHeight],
  );
  const excessHeight = useMemo(
    () => height - visibleHeight,
    [height, visibleHeight],
  );
  const initialOffsetY = useMemo(() => {
    return -(containerHeight - visibleHeight) / 2;
  }, [containerHeight, visibleHeight]);
  const halfItemOffset = useMemo(
    () => (visibleItemCount % 2 === 0 ? itemHeight / 2 : 0),
    [visibleItemCount, itemHeight],
  );
  const computeRenderRange = useCallback(
    (offsetY: number) => {
      const renderRange = [
        offsetY + _extraRenderItem * itemHeight - halfItemOffset,
        offsetY -
          (visibleItemCount + _extraRenderItem) * itemHeight -
          halfItemOffset,
      ];
      return renderRange as [number, number];
    },
    [visibleHeight, _extraRenderItem, itemHeight, halfItemOffset],
  );
  const computeRenderBoundray = useCallback(
    (offsetY: number) => {
      const [start, end] = computeRenderRange(offsetY);
      const renderBoundray = [start - _renderThreshold, end + _renderThreshold];
      return renderBoundray as [number, number];
    },
    [computeRenderRange, _renderThreshold],
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

      const count = visibleItemCount + 2 * _extraRenderItem;
      const topLen = _extraRenderItem + Math.ceil(visibleItemCount / 2);

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
    [cycliData, _extraRenderItem, debug],
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
      const velocity = event.velocityY < 0 ? -maxAbsVelocity : maxAbsVelocity;
      const expectedVelocityEffectedOffset =
        Math.abs(velocity) < 100 ? 0 : velocity / 3;
      const expectedOffset = Math.round(
        (offset.value + expectedVelocityEffectedOffset - initialOffsetY) /
          itemHeight,
      );
      const expectedRechedOffset = initialOffsetY + expectedOffset * itemHeight;
      offset.value = withSpring(
        expectedRechedOffset,
        {
          velocity: event.velocityY,
          damping: 100,
        },
        finished => {
          if (finished && onChange) {
            let idx = expectedOffset % len;
            idx = idx > 0 ? len - idx : Math.abs(idx);
            runOnJS(onChange)(data[idx].value, idx);
          }
        },
      );
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
    <View style={{height, marginTop: excessHeight / 2}}>
      <View className="relative">
        <View
          style={{
            height: visibleHeight,
            overflow: 'hidden',
          }}>
          <GestureDetector gesture={pan}>
            <Reanimated.View ref={ref} style={[animatedStyles]}>
              <View
                className="relative"
                style={{
                  height: containerHeight,
                }}>
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
                  <ItemComponent
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
            <IndicatorComponent itemHeight={itemHeight} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(forwardRef(Selector));
