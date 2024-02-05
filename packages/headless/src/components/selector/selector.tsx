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
  itemHeight?: number;
  containerHeight?: number;
  extraRenderItem?: number;
  renderThreshold?: number;
  boundaryIndicator?: boolean;
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
    itemHeight = 30,
    containerHeight = 2001 * itemHeight,
    extraRenderItem = 2 * visibleItemCount,
    renderThreshold = Math.ceil(extraRenderItem / 2) * itemHeight,
    boundaryIndicator = false,
    maxVelocity = Number.MAX_SAFE_INTEGER,
    Item = ItemComponent,
    Indicator = IndicatorComponent,
  } = props;
  const len = useMemo(() => data.length, [data.length]);
  const _visibleItemCount = useMemo(
    () => (visibleItemCount >= len ? len : visibleItemCount),
    [visibleItemCount, len],
  );
  const _height = useMemo(
    () => height ?? itemHeight * _visibleItemCount,
    [height, itemHeight, _visibleItemCount],
  );
  const initialOffsetY = useMemo(
    () => -(containerHeight - _visibleItemCount * itemHeight) / 2,
    [],
  );
  const computeRenderRange = useCallback(
    (offsetY: number) => {
      const halfItemOffset = visibleItemCount % 2 === 0 ? itemHeight / 2 : 0;
      const renderRange = [
        offsetY + extraRenderItem * itemHeight - halfItemOffset,
        offsetY -
          (visibleItemCount + extraRenderItem) * itemHeight -
          halfItemOffset,
      ];
      return renderRange as [number, number];
    },
    [itemHeight, extraRenderItem, renderThreshold],
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
  const cycliData = useMemo(() => DoubleLinkList(data, true), [data]);
  const generateRenderList = useCallback(
    (baseIndex: number, renderRange: [number, number]) => {
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

      return result;
    },
    [cycliData, extraRenderItem],
  );
  const [innerData, setInnerData] = useState(
    generateRenderList(0, renderRange.current),
  );
  const lazyRender = useEvent((offsetY: number) => {
    'worklet';
    const [startBoundary, endBoundary] = renderBoundary.current;
    const bottomOffset = visibleItemCount * itemHeight;
    if (!(offsetY >= startBoundary || offsetY - bottomOffset <= endBoundary))
      return;

    const offsetIdx = Math.floor((offsetY - initialOffsetY) / itemHeight) % len;
    let baseIdx = 0;
    if (offsetIdx > 0) {
      baseIdx = len - offsetIdx;
    } else {
      baseIdx = Math.abs(offsetIdx);
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
      offset.value = withDecay({
        velocity: Math.min(event.velocityY, maxVelocity),
        rubberBandEffect: true,
        clamp: [-containerHeight, 0],
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
              {innerData.map((item, index) => (
                <Item
                  key={`${item.wrapped.value}_${index}`}
                  top={-item.top}
                  itemHeight={itemHeight}
                  label={item.wrapped.label}
                />
              ))}
              {boundaryIndicator && (
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
