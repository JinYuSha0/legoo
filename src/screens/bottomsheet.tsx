import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {usePortalContext} from '@legoo/headless';
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
import React, {useCallback, memo, forwardRef, useImperativeHandle} from 'react';
import clsx from 'clsx';

interface Closeable {
  close: (cb?: () => void) => void;
}

interface IBottomSheetProps {
  index?: number;
  snapPoints: (string | number)[];
  enableDrag?: boolean;
  enableHandleAreaDrag?: boolean;
  enableContentAreaDrag?: boolean;
  enableDragDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  enableMountAnimation?: boolean;
  enableUnmountAnimation?: boolean;
  animationConfig?: WithSpringConfig;
  onClose: () => void;
}

const defaultAnimationConfig: WithSpringConfig = {
  duration: 200,
  dampingRatio: 1,
  stiffness: 1,
  overshootClamping: false,
  restDisplacementThreshold: 150,
  restSpeedThreshold: 150,
  reduceMotion: ReduceMotion.System,
};

const BottomSheet: React.ForwardRefRenderFunction<
  Closeable,
  React.PropsWithChildren<IBottomSheetProps>
> = (props, ref) => {
  const {
    index = 0,
    snapPoints,
    enableDrag = true,
    enableDragDownToClose = true,
    enableDynamicSizing = true,
    enableMountAnimation = true,
    enableUnmountAnimation = true,
    animationConfig = defaultAnimationConfig,
    children,
    onClose,
  } = props;
  const {closeableRef} = usePortalContext();
  const animatedRef = useAnimatedRef();
  const currSnapPoint = snapPoints[index];
  const computeSnapPoint = currSnapPoint as number;
  const offset = useSharedValue(computeSnapPoint);
  const height = useSharedValue(computeSnapPoint);
  const opacity = useSharedValue(enableDynamicSizing ? 0 : 1);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: offset.value}],
  }));
  const onLayout = useCallback(() => {
    runOnUI(() => {
      const measurement = measure(animatedRef);
      if (measurement === null) return;
      height.value = measurement.height;
      offset.value = enableMountAnimation ? measurement.height : 0;
      opacity.value = withSpring(1, {duration: 160});
      if (enableMountAnimation) offset.value = withSpring(0, animationConfig);
    })();
  }, []);
  const close = useCallback((cb?: () => void) => {
    'worklet';
    if (enableUnmountAnimation || offset.value !== 0) {
      offset.value = withSpring(height.value, animationConfig, finished => {
        finished && runOnJS(cb ?? onClose)();
      });
    } else {
      runOnJS(cb ?? onClose)();
    }
  }, []);
  const recover = useCallback(() => {
    'worklet';
    offset.value = withSpring(0, animationConfig);
  }, []);
  const pan = Gesture.Pan()
    .onChange(event => {
      offset.value = clamp(offset.value + event.changeY, 0, height.value);
    })
    .onFinalize(event => {
      if (event.velocityY < 0 && offset.value === 0) return;
      if (enableDragDownToClose) {
        if (event.velocityY > 300) {
          close();
        } else {
          if (offset.value > height.value * (1 / 3)) {
            close();
          } else {
            recover();
          }
        }
      }
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
      className={clsx('bg-background')}
      style={[animatedStyles, !enableDynamicSizing ? {height} : null]}
      onLayout={enableDynamicSizing ? onLayout : undefined}>
      <GestureDetector gesture={enableDrag ? pan : Gesture.Pan()}>
        <View className="flex">
          <View className="h-6 w-full bg-zinc-800"></View>
        </View>
      </GestureDetector>
      {children}
    </Reanimated.View>
  );
};

export default memo(forwardRef(BottomSheet));
