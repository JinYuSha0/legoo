import type {PressableProps} from 'react-native';
import {Text, Pressable} from 'react-native';
import {cva, type VariantProps} from 'cva';
import React, {forwardRef, ForwardRefRenderFunction, memo} from 'react';
import clsx from 'clsx';

const buttonVariants = cva({
  base: 'inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none',
  variants: {
    variant: {
      default: 'bg-primary active:bg-primary/90',
      destructive: 'bg-destructive active:bg-destructive/90',
      outline: 'border border-input active:bg-accent',
      secondary: 'bg-secondary active:bg-secondary/80',
      ghost: 'active:bg-accent',
      link: '',
      none: '',
    },
    size: {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const textVariants = cva({
  base: 'text-base font-semibold text-center',
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: '',
      secondary: 'text-secondary-foreground',
      ghost: '',
      link: 'underline-offset-4 active:underline text-primary',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface IButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const Button: ForwardRefRenderFunction<any, IButtonProps> = (props, ref) => {
  const {
    className,
    textClassName,
    children,
    variant,
    size,
    disabled = false,
    ...rest
  } = props;
  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      className={clsx(
        buttonVariants({
          variant,
          size,
        }),
        {
          'opacity-50 pointer-events-none': disabled,
        },
        className,
      )}
      {...rest}>
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text
          className={clsx(textVariants({variant, className: textClassName}))}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};

Button.displayName = 'Button';

export default memo(forwardRef(Button));
