import {TouchableWithoutFeedback, View} from 'react-native';
import {cva, type VariantProps} from 'cva';
import {useNavigation} from '@react-navigation/native';
import Layout from '../layout/layout';
import React, {type ForwardRefRenderFunction, memo, forwardRef} from 'react';
import clsx from 'clsx';

const portalVariants = cva({
  base: 'flex-col',
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

export interface PortalProps extends VariantProps<typeof portalVariants> {
  className?: string;
  closeable?: boolean;
  overlayClosable?: boolean;
}

const Portal: ForwardRefRenderFunction<
  View,
  React.PropsWithChildren<PortalProps>
> = (props, ref) => {
  const {
    children,
    direction,
    overlay,
    className,
    closeable = true,
    overlayClosable = true,
  } = props;
  const navigation = useNavigation();
  return (
    <Layout
      ref={ref}
      contentContainerClassName={clsx(
        portalVariants({direction, overlay}),
        className,
      )}
      keyboardShouldPersistTaps="never">
      {closeable && overlayClosable && (
        <TouchableWithoutFeedback className="z-10" onPress={navigation.goBack}>
          <View className="absolute top-0 left-0 bottom-0 right-0" />
        </TouchableWithoutFeedback>
      )}
      {children}
    </Layout>
  );
};

Portal.displayName = 'Portal';

export default memo(forwardRef(Portal));
