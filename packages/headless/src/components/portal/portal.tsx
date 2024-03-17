import type {IPortalFeture} from './types';
import {TouchableWithoutFeedback, View} from 'react-native';
import {type VariantProps, cva, cx} from 'class-variance-authority';
import {useHardwareBackPress} from '@legoo/hooks';
import {usePortalContext} from './context';
import Layout from '../layout/layout';
import React, {
  type ForwardRefRenderFunction,
  memo,
  forwardRef,
  useCallback,
} from 'react';

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
    IPortalFeture {
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
    overlay,
    className,
    closeable = true,
    overlayClosable = true,
  } = props;
  const {closeWithAnimation} = usePortalContext();
  const handleHardwareBackPress = useCallback(() => {
    if (closeable) {
      closeWithAnimation(() =>
        future.reject('Portal screen closed by hardware back press'),
      );
    }
    return true;
  }, [future, closeable]);
  const overlayClose = useCallback(() => {
    closeWithAnimation(() =>
      future.reject('Portal screen closed by overlay press'),
    );
  }, [future]);
  useHardwareBackPress(true, handleHardwareBackPress);
  return (
    <Layout
      ref={ref}
      contentContainerClassName={cx(
        portalVariants({direction, overlay}),
        className,
      )}
      bounces={false}
      keyboardShouldPersistTaps="never">
      {closeable && overlayClosable && (
        <TouchableWithoutFeedback className="z-10" onPress={overlayClose}>
          <View className="absolute top-0 left-0 bottom-0 right-0" />
        </TouchableWithoutFeedback>
      )}
      {children}
    </Layout>
  );
};

Portal.displayName = 'Portal';

export default memo(forwardRef(Portal));
