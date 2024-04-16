import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {usePortalContext} from '@legoo/headless';
import {last} from '@legoo/helper';
import {cx} from 'class-variance-authority';
import Reanimated, {
  type WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  measure,
  useAnimatedRef,
  runOnUI,
  ReduceMotion,
  clamp,
  runOnJS,
} from 'react-native-reanimated';
import React, {
  useCallback,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

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
  duration: 332,
  dampingRatio: 0.8,
  stiffness: 100,
  restDisplacementThreshold: 150,
  restSpeedThreshold: 150,
  reduceMotion: ReduceMotion.System,
};

const defaultClosingAnimationConfig: WithSpringConfig = {
  duration: 166,
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
    header,
    onClose,
  } = props;
  const {closeableRef} = usePortalContext();
  const animatedRef = useAnimatedRef();
  const tempStartOffsetRef = useRef(0);
  const sortedSnapPoints = useMemo(
    () =>
      Array.isArray(snapPoints) ? snapPoints.slice().sort((a, b) => a - b) : [],
    [snapPoints],
  );
  const currSnapPointIdxRef = useRef(index);
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
  const offset = useSharedValue(initOffset);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));
  const onLayout = useCallback(() => {
    runOnUI(() => {
      if (enableDynamicSizing) {
        const measurement = measure(animatedRef);
        if (measurement === null) return;
        height.value = measurement.height;
        offset.value = enableMountAnimation ? measurement.height : 0;
      }
      if (enableMountAnimation)
        offset.value = withSpring(initOffset, animationShowingConfig);
    })();
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
  const pan = Gesture.Pan()
    .onBegin(() => {
      tempStartOffsetRef.current = offset.value;
    })
    .onChange(event => {
      offset.value = clamp(offset.value + event.changeY, 0, height.value);
    })
    .onFinalize(event => {
      // 实际偏移 正数向下 负数向上
      const translationY = event.translationY - tempStartOffsetRef.current;
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
      if (nextHeightIdx < 0) {
        close();
        return;
      }
      const nextHeight = snapPoints[nextHeightIdx];
      offset.value = withSpring(
        height.value - nextHeight,
        animationShowingConfig,
      );
    });
  useImperativeHandle(closeableRef, () => ({
    close,
  }));
  useImperativeHandle(ref, () => ({
    close,
  }));
  return (
    <Reanimated.View
      ref={animatedRef}
      className={cx('w-screen', className)}
      style={[animatedStyles, !enableDynamicSizing ? {height} : null]}
      onLayout={onLayout}>
      <GestureDetector gesture={enableDrag ? pan : Gesture.Pan()}>
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
      </GestureDetector>
      <View className={cx('bg-background', bodyClassName)}>{children}</View>
    </Reanimated.View>
  );
};

export default memo(forwardRef(BottomSheet));
