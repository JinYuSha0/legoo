import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  isValidElement,
} from 'react';
import {type VariantProps, cva, cx} from 'class-variance-authority';
import {View, Text} from 'react-native';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

export interface ILabelProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof labelVariants> {
  textClassName?: string;
}

const Label: ForwardRefRenderFunction<
  React.ElementRef<typeof View>,
  ILabelProps
> = ({className, textClassName, children, ...props}, ref) => (
  <View ref={ref} className={cx(labelVariants(), className)} {...props}>
    {isValidElement(children) ? (
      children
    ) : (
      <Text className={cx('text-sm font-medium', textClassName)}>
        {children}
      </Text>
    )}
  </View>
);

Label.displayName = 'Label';

export default memo(forwardRef(Label));
