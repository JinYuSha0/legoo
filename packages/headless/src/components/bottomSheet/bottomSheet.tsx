import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import {LayoutChangeEvent, View} from 'react-native';
import {usePortalContext} from '@legoo/headless';
import {cx} from 'class-variance-authority';
import Reanimated, {
  type WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedRef,
  runOnUI,
  ReduceMotion,
  clamp,
  runOnJS,
  makeMutable,
  useAnimatedScrollHandler,
  useAnimatedProps,
} from 'react-native-reanimated';
import React, {
  useCallback,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {last} from '@legoo/helper';

const AnimatedScrollView = Reanimated.createAnimatedComponent(ScrollView);

interface Closeable {
  close: (cb?: () => void) => void;
}

interface IBottomSheetPropsCommon {
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  indicadorClassName?: string;
  index?: number;
  snapPoints?: number[];
  scrollable?: boolean;
  enableDrag?: boolean;
  enableHandleAreaDrag?: boolean;
  enableContentAreaDrag?: boolean;
  enableDragDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  enableMountAnimation?: boolean;
  enableUnmountAnimation?: boolean;
  animationShowingConfig?: WithSpringConfig;
  animationClosingConfig?: WithSpringConfig;
  CLOSE_MAX_VELOCITY?: number;
  DEFAULT_HEIGHT?: number;
  SNAP_PROPORTION?: number;
  top?: React.ReactElement;
  header?: React.ReactElement;
  onClose: () => void;
}

interface IBottomSheetPropsDynamic extends IBottomSheetPropsCommon {
  enableDynamicSizing: true;
}

interface IBottomSheetPropsSnap extends IBottomSheetPropsCommon {
  index: number;
  snapPoints: number[];
}

export type IBottomSheetProps =
  | IBottomSheetPropsDynamic
  | IBottomSheetPropsSnap;

const defaultShowingAnimationConfig: WithSpringConfig = {
  duration: 300,
  dampingRatio: 0.7,
  stiffness: 100,
  restDisplacementThreshold: 150,
  restSpeedThreshold: 150,
  reduceMotion: ReduceMotion.System,
};

const defaultClosingAnimationConfig: WithSpringConfig = {
  duration: 125,
  dampingRatio: 0.8,
  stiffness: 100,
  restDisplacementThreshold: 150,
  restSpeedThreshold: 150,
  reduceMotion: ReduceMotion.System,
};

const BottomSheet: React.ForwardRefRenderFunction<
  Closeable,
  React.PropsWithChildren<IBottomSheetProps>
> = (props, ref) => {
  const {
    className,
    headerClassName,
    bodyClassName,
    indicadorClassName,
    index = 0,
    snapPoints = [],
    scrollable = false,
    enableDrag = true,
    enableDragDownToClose = true,
    enableDynamicSizing = false,
    enableMountAnimation = true,
    enableUnmountAnimation = true,
    animationShowingConfig = defaultShowingAnimationConfig,
    animationClosingConfig = defaultClosingAnimationConfig,
    CLOSE_MAX_VELOCITY = 300,
    DEFAULT_HEIGHT = 300,
    SNAP_PROPORTION = 1 / 4,
    children,
    top,
    header,
    onClose,
  } = props;
  const {closeableRef} = usePortalContext();
  const isLayoutRef = useRef(false);
  const tempStartOffsetRef = useRef(0);
  const currSnapPointIdxRef = useRef(index);
  const scrollRef = useAnimatedRef<ScrollView>();
  const sortedSnapPoints = useMemo(
    () =>
      Array.isArray(snapPoints) ? snapPoints.slice().sort((a, b) => a - b) : [],
    [snapPoints],
  );
  const maxHeight = useMemo(() => {
    if (!enableDynamicSizing) {
      return last(sortedSnapPoints)!;
    }
    return 0;
  }, []);
  const initOffset = useMemo(() => {
    if (!enableDynamicSizing) {
      return Math.abs(maxHeight - (snapPoints[index] ?? DEFAULT_HEIGHT));
    }
    return 0;
  }, []);
  const height = useSharedValue(maxHeight);
  const offset = useSharedValue(maxHeight);
  const scroll = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);
  const scrollContentViewHeight = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    height: height.value === 0 ? undefined : height.value,
    transform: [{translateY: offset.value}],
  }));
  const scrollAnimatedProps = useAnimatedProps(
    () => ({
      decelerationRate: offset.value !== 0 ? 0 : 0.998,
      contentOffset: offset.value === 0 ? undefined : {x: 0, y: scroll.value},
    }),
    [sortedSnapPoints],
  );
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    if (isLayoutRef.current) return;
    isLayoutRef.current = true;
    const _height = e.nativeEvent.layout.height;
    runOnUI(() => {
      if (enableDynamicSizing && _height > 0) {
        height.value = _height;
        offset.value = enableMountAnimation ? _height : 0;
      }
      if (enableMountAnimation)
        offset.value = withSpring(initOffset, animationShowingConfig);
    })();
  }, []);
  const onScrollLayout = useCallback(async (e: LayoutChangeEvent) => {
    scrollViewHeight.value = e.nativeEvent.layout.height;
  }, []);
  const onScrollContentLayout = useCallback((e: LayoutChangeEvent) => {
    scrollContentViewHeight.value = e.nativeEvent.layout.height;
  }, []);
  const close = useCallback((cb?: () => void) => {
    'worklet';
    if (enableUnmountAnimation || offset.value !== 0) {
      offset.value = withSpring(
        height.value,
        animationClosingConfig,
        finished => {
          finished && runOnJS(cb ?? onClose)();
        },
      );
    } else {
      runOnJS(cb ?? onClose)();
    }
  }, []);
  const recover = useCallback(() => {
    'worklet';
    offset.value = withSpring(0, animationShowingConfig);
  }, []);
  const getNextHeightIdx = useCallback(
    (translationY: number, currIdx: number) => {
      'worklet';
      const currSnapHeight = snapPoints[currIdx];
      // 目前的高度
      const currHeight = currSnapHeight - translationY;
      // 当前的snap高度
      // 转换为排序后的index
      let nextIdx = sortedSnapPoints.findIndex(val => val === currSnapHeight);
      // 没变化
      if (translationY === 0) return currIdx;
      if (translationY > 0) {
        // 向下找比当前高度小的
        for (let i = 0; i < sortedSnapPoints.length; i++) {
          if (currHeight < (sortedSnapPoints[i + 1] ?? 0)) {
            nextIdx = i;
            break;
          }
        }
      } else {
        // 向上找比当前高度大的
        for (let i = sortedSnapPoints.length - 1; i > 0; i--) {
          if (
            currHeight > (sortedSnapPoints[i - 1] ?? Number.MAX_SAFE_INTEGER)
          ) {
            nextIdx = i;
            break;
          }
        }
      }
      // 关闭的情况
      if (
        translationY > 0 &&
        currHeight < (sortedSnapPoints[0] ?? 0) &&
        translationY >= sortedSnapPoints[0] * SNAP_PROPORTION
      ) {
        if (!enableDragDownToClose) {
          return snapPoints.findIndex(val => val === sortedSnapPoints[0]);
        }
        return -1;
      }
      const targetHeight = sortedSnapPoints[nextIdx];
      const diffHeight = Math.abs(currSnapHeight - targetHeight);
      const shouldSnap = Math.abs(translationY) >= diffHeight * SNAP_PROPORTION;
      if (shouldSnap) {
        // 需要snap
        return snapPoints.findIndex(val => val === sortedSnapPoints[nextIdx]);
      } else {
        // 不需要snap
        recover();
        return currIdx;
      }
    },
    [enableDynamicSizing, snapPoints, sortedSnapPoints],
  );
  const scrollHandler = useAnimatedScrollHandler(event => {
    scroll.value = event.contentOffset.y;
  });
  const dragPanGesture = useMemo(() => {
    const tempScrollOffsetRef = makeMutable(0);
    return Gesture.Pan()
      .onBegin(() => {
        tempStartOffsetRef.current = offset.value;
        scrollable && (tempScrollOffsetRef.value = scroll.value);
      })
      .onChange(event => {
        if (
          scrollable &&
          ((event.changeY > 0 && scroll.value !== 0) ||
            (event.changeY < 0 && offset.value === 0))
        ) {
          scroll.value = clamp(
            scroll.value - event.changeY,
            0,
            scrollContentViewHeight.value - scrollViewHeight.value,
          );
          return;
        }
        offset.value = clamp(offset.value + event.changeY, 0, height.value);
      })
      .onFinalize(event => {
        if (scrollable && tempStartOffsetRef.current === offset.value) {
          // scrollView 滑动
          return;
        }
        // 实际偏移 正数向下 负数向上
        const translationY =
          event.translationY -
          tempStartOffsetRef.current -
          tempScrollOffsetRef.value;
        // 滑动速度大于阈值关闭
        if (
          enableDragDownToClose &&
          translationY > 0 &&
          event.velocityY > CLOSE_MAX_VELOCITY
        ) {
          close();
          return;
        }
        // 动态高度 没有snap
        if (enableDynamicSizing) {
          if (translationY > height.value * SNAP_PROPORTION) {
            close();
          } else {
            recover();
          }
          return;
        }
        let nextHeightIdx = (currSnapPointIdxRef.current = getNextHeightIdx(
          translationY,
          currSnapPointIdxRef.current,
        ));
        if (nextHeightIdx < 0 && enableDragDownToClose) {
          close();
          return;
        }
        const nextHeight = snapPoints[nextHeightIdx];
        offset.value = withSpring(
          clamp(height.value - nextHeight, 0, height.value),
          animationShowingConfig,
        );
      })
      .shouldCancelWhenOutside(false)
      .simultaneousWithExternalGesture(scrollRef)
      .enabled(enableDrag && (scrollable ? offset.value !== 0 : true));
  }, [enableDrag, scrollable]);
  const body = useMemo(() => {
    return scrollable ? (
      <AnimatedScrollView
        ref={scrollRef}
        className={cx('flex-1', bodyClassName)}
        bounces={false}
        contentContainerClassName="grow"
        animatedProps={scrollAnimatedProps}
        onLayout={onScrollLayout}
        onScroll={scrollHandler}>
        <Reanimated.View onLayout={onScrollContentLayout}>
          {children}
        </Reanimated.View>
      </AnimatedScrollView>
    ) : (
      <View className={cx('flex-1', bodyClassName)}>{children}</View>
    );
  }, [scrollable, bodyClassName, children, children, scrollAnimatedProps]);
  const content = useMemo(() => {
    return (
      <Reanimated.View
        className={cx('w-screen', className)}
        style={animatedStyles}
        onLayout={onLayout}>
        <GestureDetector gesture={dragPanGesture}>
          <View className="flex-1 overflow-hidden">
            {top}
            <View>
              {header ? (
                header
              ) : (
                <View className="flex">
                  <View
                    className={cx(
                      'bg-background h-6 w-full items-center justify-center',
                      headerClassName,
                    )}>
                    <View
                      className={cx(
                        'h-[6px] w-32 rounded-md bg-border',
                        indicadorClassName,
                      )}
                    />
                  </View>
                </View>
              )}
            </View>
            {body}
          </View>
        </GestureDetector>
      </Reanimated.View>
    );
  }, [
    dragPanGesture,
    className,
    header,
    headerClassName,
    indicadorClassName,
    animatedStyles,
    enableDynamicSizing,
    body,
  ]);
  useImperativeHandle(closeableRef, () => ({
    close,
  }));
  useImperativeHandle(ref, () => ({
    close,
  }));
  return content;
};

export default memo(forwardRef(BottomSheet));
