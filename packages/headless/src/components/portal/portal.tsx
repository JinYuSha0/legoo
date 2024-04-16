import type {IPortalFuture} from './types';
import {TouchableWithoutFeedback, View} from 'react-native';
import {type VariantProps, cva, cx} from 'class-variance-authority';
import {useEvent, useHardwareBackPress} from '@legoo/hooks';
import {usePortalContext} from './context';
import Layout from '../layout/layout';
import React, {
  type ForwardRefRenderFunction,
  memo,
  forwardRef,
  useCallback,
} from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const portalVariants = cva('flex-col', {
  variants: {
    overlay: {
      default: 'bg-black/60',
      none: 'bg-transparent',
    },
    direction: {
      middleLeft: 'items-start justify-center',
      middleCenter: 'items-center justify-center',
      middleRight: 'items-end justify-center',
      topLeft: 'items-start justify-start',
      topCenter: 'items-center justify-start',
      topRight: 'items-end justify-start',
      bottomLeft: 'items-start justify-end',
      bottomCenter: 'items-center justify-end',
      bottomRight: 'items-end justify-end',
    },
  },
  defaultVariants: {
    overlay: 'default',
    direction: 'middleCenter',
  },
});

export interface IPortalProps
  extends VariantProps<typeof portalVariants>,
    IPortalFuture {
  className?: string;
  closeable?: boolean;
  overlayClosable?: boolean;
}

const Portal: ForwardRefRenderFunction<
  View,
  React.PropsWithChildren<IPortalProps>
> = (props, ref) => {
  const {
    future,
    children,
    direction,
    className,
    closeable = true,
    overlay = 'default',
    overlayClosable = true,
    bottomColor,
  } = props;
  const bgValue = useSharedValue(1);
  const StatusBar = useStatusBar('light-content');
  const {closeWithAnimation} = usePortalContext();
  const bgStyle = useAnimatedStyle(
    () => ({
      backgroundColor:
        overlay === 'none'
          ? 'transparent'
          : interpolateColor(
              bgValue.value,
              [1, 0],
              ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'],
            ),
    }),
    [overlay],
  );
  const close = useEvent((reason: string) => {
    if (!closeable) return;
    bgValue.value = withSpring(0, {
      duration: 80,
    });
    closeWithAnimation(() => future.reject(new Error(reason)));
  });
  const handleHardwareBackPress = useCallback(() => {
    close('Portal screen closed by hardware back press');
    return true;
  }, [future, closeable]);
  const overlayClose = useCallback(() => {
    close('Portal screen closed by overlay press');
  }, [future]);
  return (
    <Layout
      ref={ref}
      translucent
      contentContainerClassName={cx(portalVariants({direction}), className)}
      bounces={false}
      keyboardShouldPersistTaps="never"
      bottomColor={bottomColor}
      onHardwareBackPress={handleHardwareBackPress}>
      {StatusBar}
      {closeable && overlayClosable && (
        <TouchableWithoutFeedback className="z-10" onPress={overlayClose}>
          <Animated.View
            className="absolute top-0 left-0 bottom-0 right-0"
            style={bgStyle}
          />
        </TouchableWithoutFeedback>
      )}
      {children}
    </Layout>
  );
};

Portal.displayName = 'Portal';

export default memo(forwardRef(Portal));
