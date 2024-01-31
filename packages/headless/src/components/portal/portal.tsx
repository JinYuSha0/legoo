import {View} from 'react-native';
import {cva, type VariantProps} from 'cva';
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
  preventBack?: boolean;
  className?: string;
}

const Portal: ForwardRefRenderFunction<
  View,
  React.PropsWithChildren<PortalProps>
> = (props, ref) => {
  const {children, direction, overlay, className} = props;
  return (
    <Layout
      ref={ref}
      contentContainerClassName={clsx(
        portalVariants({direction, overlay}),
        className,
      )}>
      {children}
    </Layout>
  );
};

Portal.displayName = 'Portal';

export default memo(forwardRef(Portal));
