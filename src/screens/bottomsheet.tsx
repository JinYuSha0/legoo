import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Reanimated, {
  type WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
  withSpring,
  measure,
  useAnimatedRef,
  runOnUI,
  ReduceMotion,
  clamp,
} from 'react-native-reanimated';
import React, {
  useCallback,
  memo,
  forwardRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import clsx from 'clsx';

interface IBottomSheetProps {
  index?: number;
  snapPoints: (string | number)[];
  enableDrag?: boolean;
  enableHandleAreaDrag?: boolean;
  enableContentAreaDrag?: boolean;
  enableDragDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  enableMountAnimation?: boolean;
  animationConfig?: WithSpringConfig;
  onClose?: () => void;
}

const defaultAnimationConfig: WithSpringConfig = {
  duration: 480,
  dampingRatio: 1,
  stiffness: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
};

const BottomSheet: React.ForwardRefRenderFunction<
  Reanimated.View,
  React.PropsWithChildren<IBottomSheetProps>
> = (props, ref) => {
  const {
    index = 0,
    snapPoints,
    enableDrag = true,
    enableContentAreaDrag = true,
    enableDragDownToClose = true,
    enableDynamicSizing = true,
    enableMountAnimation = true,
    animationConfig = defaultAnimationConfig,
    children,
  } = props;
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
      if (enableMountAnimation) offset.value = measurement.height;
      opacity.value = withSpring(1, {duration: 160});
    })();
  }, []);
  const pan = Gesture.Pan().onChange(event => {
    offset.value += event.changeY;
  });
  useAnimatedReaction(
    () => offset.value,
    value => {
      if (value !== 0 && enableMountAnimation)
        offset.value = withSpring(0, animationConfig);
    },
  );
  return (
    <GestureDetector gesture={enableDrag ? pan : Gesture.Pan()}>
      <Reanimated.View
        ref={animatedRef}
        className={clsx('bg-background')}
        style={[animatedStyles, !enableDynamicSizing ? {height} : null]}
        onLayout={enableDynamicSizing ? onLayout : undefined}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

export default memo(forwardRef(BottomSheet));
