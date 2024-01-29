import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  isValidElement,
} from 'react';
import {cva, type VariantProps} from 'cva';
import clsx from 'clsx';
import {View, Text} from 'react-native';

const labelVariants = cva({
  base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
});

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof labelVariants> {
  textClassName?: string;
}

const Label: ForwardRefRenderFunction<
  React.ElementRef<typeof View>,
  LabelProps
> = ({className, textClassName, children, ...props}, ref) => (
  <View ref={ref} className={clsx(labelVariants(), className)} {...props}>
    {isValidElement(children) ? (
      children
    ) : (
      <Text className={clsx('text-sm font-medium', textClassName)}>{children}</Text>
    )}
  </View>
);
Label.displayName = 'Label';

export default memo(forwardRef(Label));
