import {View, Text} from 'react-native';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  ReactNode,
  isValidElement,
} from 'react';
import {cva, type VariantProps} from 'cva';
import clsx from 'clsx';

const badgeVariants = cva({
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  variants: {
    variant: {
      default:
        'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary:
        'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {
  textClassName?: string;
}

const Badge: ForwardRefRenderFunction<any, BadgeProps> = (props, ref) => {
  const {className, textClassName, variant, children, ...rest} = props;
  return (
    <View
      ref={ref}
      className={clsx(badgeVariants({variant}), className)}
      {...rest}>
      {isValidElement(children) ? (
        children
      ) : (
        <Text className={clsx('text-foreground', textClassName)}>
          {children}
        </Text>
      )}
    </View>
  );
};

export default memo(forwardRef(Badge));
