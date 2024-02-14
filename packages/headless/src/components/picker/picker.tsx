import type {IPickerProps, WrapItem} from './type';
import {Platform, View} from 'react-native';
import {isNil, last, DoubleLinkList} from '@legoo/helper';
import {useEvent, useNextEffect} from '@legoo/hooks';
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

const Picker: ForwardRefRenderFunction<Reanimated.View, IPickerProps> = (
  props,
  ref,
) => {
  const {
    data,
    height,
    cycle = false,
    clickable = false,
    initialIndex = 0,
    itemHeight = 30,
    containerHeight = 10000 * itemHeight,
    extraRenderItem,
    renderThreshold,
    debug = false,
    maxVelocity = Number.MAX_SAFE_INTEGER,
    velocityYClickThreshould = Platform.select({
      ios: 10,
      android: 50,
    }),
    ItemComponent = DefaultItemComponent,
    IndicatorComponent = DefaultIndicatorComponent,
    keyExtractor,
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
  const preValue = useSharedValue(data[_initialIndex].value);
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
    (baseIndex: number, renderRange: [number, number], imporve?: boolean) => {
      let startTime = 0;

      if (debug) {
        startTime = performance.now();
      }

      const result: WrapItem[] = [];
      const [_, map] = cycliData;
      const baseNode = map.get(baseIndex);

      const topVisibleCount = Math.floor(visibleItemCount / 2);
      const topLen = _extraRenderItem + topVisibleCount;
      let topStartOffset =
        renderRange[0] - (topLen - (halfItemOffset === 0 ? 1 : 2)) * itemHeight;
      let head = baseNode.prev;
      for (let i = 0; i < topLen; i++) {
        if (!cycle && head.value === last(data)) break;
        if (!isNil(head?.value)) {
          result.unshift({
            top: topStartOffset,
            wrapped: head?.value,
            direction: -1,
            lazy: imporve ? i > topVisibleCount : false,
          });
          head = head.prev;
          topStartOffset += itemHeight;
        } else {
          break;
        }
      }

      const bottomVisibleCount = Math.ceil(visibleItemCount / 2);
      const bottomLen = _extraRenderItem + bottomVisibleCount;
      let bottomStartOffset = renderRange[0] - (bottomLen - 1) * itemHeight;
      let tail = baseNode;
      for (let i = 0; i < bottomLen; i++) {
        if (!cycle && last(result)?.wrapped === last(data)) break;
        if (!isNil(tail?.value)) {
          result.push({
            top: bottomStartOffset,
            wrapped: tail?.value,
            direction: 1,
            lazy: imporve ? i > bottomVisibleCount : false,
          });
          tail = tail?.next;
          bottomStartOffset -= itemHeight;
        } else {
          break;
        }
      }

      if (debug && !imporve) {
        console.debug(
          `Render List generated in: ${performance.now() - startTime}ms`,
        );
      }

      return result;
    },
    [cycliData, _extraRenderItem, debug],
  );
  const initialData = useMemo(
    () => generateRenderList(_initialIndex, renderRange.current, true),
    [_initialIndex],
  );
  const [innerData, setInnerData] = useState(initialData);
  const lazyRender = useEvent((offsetY: number, reset?: boolean) => {
    'worklet';
    const [startBoundary, endBoundary] = renderBoundary.current;

    if (!reset) {
      if (!(offsetY >= startBoundary || offsetY - visibleHeight <= endBoundary))
        return;
      if (!cycle && clamp && (offsetY >= clamp.max || offsetY <= clamp.min))
        return;

      if (offsetY >= startBoundary) offsetY = startBoundary;
      if (offsetY - visibleHeight <= endBoundary)
        offsetY = endBoundary + visibleHeight;
      if (halfItemOffset > 0) offsetY -= halfItemOffset;
    }

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

    return baseIdx;
  });
  const _onChange = useEvent((value: any, index: number) => {
    if (preValue.value === value) return;
    onChange?.(value, index);
    preValue.value = value;
  });
  const listReset = useEvent(() => {
    let offsetY = offset.value;
    if (!cycle && offset.value < clamp.min) {
      offset.value = clamp.min;
      offsetY = clamp.min;
    }
    const baseIdx = lazyRender(offsetY, true);
    if (data[baseIdx]) _onChange(data[baseIdx].value, baseIdx);
  });
  const _keyExtractor = useCallback(
    (item: WrapItem, index: number) => {
      if (keyExtractor)
        return keyExtractor(item.wrapped.value, index, item.direction);
      if (len <= visibleItemCount + 2 * _extraRenderItem) {
        return `${item.wrapped.value}_${index}`;
      }
      return `${item.wrapped.value}_${item.direction}`;
    },
    [len, visibleItemCount, _extraRenderItem],
  );
  const panBeginTime = useSharedValue(-1);
  const offset = useSharedValue(initialOffsetY);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));
  const pan = Gesture.Pan()
    .onBegin(event => {
      panBeginTime.value = performance.now();
    })
    .onChange(event => {
      offset.value += event.changeY;
    })
    .onFinalize(event => {
      const duration = performance.now() - panBeginTime.value;
      let expectedRechedOffset = offset.value;
      let expectedOffsetIdx = 0;
      let finalizeIdx = null;
      if (
        clickable &&
        duration <= 150 &&
        Math.abs(event.velocityY) < velocityYClickThreshould
      ) {
        // If duration less than 150ms, judged as a click event.
        expectedOffsetIdx = -Math.round(
          (event.y - containerHeight / 2) / itemHeight,
        );
      } else {
        // velocityY less than 100, judged as a slow drag event.
        // velocityY more than 100, judged as fast scroll event
        const maxAbsVelocity = Math.min(Math.abs(event.velocityY), maxVelocity);
        const velocity = event.velocityY < 0 ? -maxAbsVelocity : maxAbsVelocity;
        const expectedVelocityEffectedOffset =
          Math.abs(velocity) < 100 ? 0 : velocity / 3;
        expectedOffsetIdx = Math.round(
          (offset.value + expectedVelocityEffectedOffset - initialOffsetY) /
            itemHeight,
        );
      }
      expectedRechedOffset = initialOffsetY + expectedOffsetIdx * itemHeight;
      if (!cycle) {
        if (expectedRechedOffset >= clamp.max) {
          expectedRechedOffset = clamp.max;
          finalizeIdx = 0;
        } else if (expectedRechedOffset <= clamp.min) {
          expectedRechedOffset = clamp.min;
          finalizeIdx = len - 1;
        }
      }
      if (finalizeIdx === null) {
        finalizeIdx = (expectedOffsetIdx - _initialIndex) % len;
        finalizeIdx =
          finalizeIdx > 0 ? len - finalizeIdx : Math.abs(finalizeIdx);
      }
      if (Math.abs(event.velocityY) < 100)
        runOnJS(_onChange)(data[finalizeIdx].value, finalizeIdx);
      offset.value = withSpring(
        expectedRechedOffset,
        {
          velocity: event.velocityY,
          damping: 100,
        },
        finished => {
          if (finished && Math.abs(event.velocityY) >= 100) {
            runOnJS(_onChange)(data[finalizeIdx].value, finalizeIdx);
          }
        },
      );
    });
  useEffect(() => {
    const id = 1;
    // Imporve first render time speend
    // reduce first render view count
    requestIdleCallback(() => {
      setInnerData(generateRenderList(_initialIndex, renderRange.current));
    });
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
  useNextEffect(listReset, [data]);
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
                {innerData
                  .filter(item => item.lazy === false)
                  .map((item, index) => (
                    <ItemComponent
                      key={_keyExtractor(item, index)}
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

export default memo(forwardRef(Picker));
