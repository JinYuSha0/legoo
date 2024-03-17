import {View, Text} from 'react-native';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  isValidElement,
} from 'react';
import {type VariantProps, cva, cx} from 'class-variance-authority';

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
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
  },
);

export interface IBadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {
  textClassName?: string;
}

const Badge: ForwardRefRenderFunction<any, IBadgeProps> = (props, ref) => {
  const {className, textClassName, variant, children, ...rest} = props;
  return (
    <View
      ref={ref}
      className={cx(badgeVariants({variant}), className)}
      {...rest}>
      {isValidElement(children) ? (
        children
      ) : (
        <Text className={cx('text-foreground', textClassName)}>{children}</Text>
      )}
    </View>
  );
};

export default memo(forwardRef(Badge));
