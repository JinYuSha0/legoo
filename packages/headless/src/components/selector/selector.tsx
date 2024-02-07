import type {ISelectorProps, WrapItem} from './type';
import {View} from 'react-native';
import {isNil, last} from '@legoo/helper';
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
import DefaultItemComponent from './item';
import DefaultIndicatorComponent from './indicator';

const Selector: ForwardRefRenderFunction<Reanimated.View, ISelectorProps> = (
  props,
  ref,
) => {
  const {
    data,
    height,
    cycle = false,
    initialIndex = 0,
    itemHeight = 30,
    containerHeight = 2000 * itemHeight,
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
      return initialIndex > 0 ? initialIndex % len : 0;
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
  const clamp = useMemo(() => {
    if (!cycle) {
      const max = initialOffsetY + _initialIndex * itemHeight;
      const min = max - (len - 1) * itemHeight;
      return {min: min, max: max};
    }
    return null;
  }, [cycle, initialOffsetY, _initialIndex, len, itemHeight]);
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

      const topLen = _extraRenderItem + Math.floor(visibleItemCount / 2);
      let topStartOffset =
        renderRange[0] - (topLen - (halfItemOffset === 0 ? 1 : 2)) * itemHeight;
      let head = baseNode.prev;
      for (let i = 0; i < topLen; i++) {
        if (!cycle && head.value === last(data)) break;
        if (!isNil(head?.value)) {
          result.unshift({
            top: topStartOffset,
            wrapped: head?.value,
          });
          head = head.prev;
          topStartOffset += itemHeight;
        } else {
          break;
        }
      }

      const bottomLen = _extraRenderItem + Math.ceil(visibleItemCount / 2);
      let bottomStartOffset = renderRange[0] - (bottomLen - 1) * itemHeight;
      let tail = baseNode;
      for (let i = 0; i < bottomLen; i++) {
        if (!cycle && last(result)?.wrapped === last(data)) break;
        if (!isNil(tail?.value)) {
          result.push({
            top: bottomStartOffset,
            wrapped: tail?.value,
          });
          tail = tail?.next;
          bottomStartOffset -= itemHeight;
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
    if (!cycle && clamp && (offsetY >= clamp.max || offsetY <= clamp.min))
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
      let expectedRechedOffset = initialOffsetY + expectedOffset * itemHeight;
      let finalizeIdx = null;
      if (!cycle) {
        if (expectedRechedOffset >= clamp.max) {
          expectedRechedOffset = clamp.max;
          finalizeIdx = 0;
        } else if (expectedRechedOffset <= clamp.min) {
          expectedRechedOffset = clamp.min;
          finalizeIdx = len - 1;
        }
      }
      offset.value = withSpring(
        expectedRechedOffset,
        {
          velocity: event.velocityY,
          damping: 100,
        },
        finished => {
          if (finished && onChange) {
            if (finalizeIdx === null) {
              finalizeIdx = (expectedOffset - _initialIndex) % len;
              finalizeIdx =
                finalizeIdx > 0 ? len - finalizeIdx : Math.abs(finalizeIdx);
            }
            runOnJS(onChange)(data[finalizeIdx].value, finalizeIdx);
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
