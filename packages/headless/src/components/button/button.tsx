import type {GestureResponderEvent, PressableProps} from 'react-native';
import {Text, Pressable, Keyboard, View, ActivityIndicator} from 'react-native';
import {type VariantProps, cva, cx} from 'class-variance-authority';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useMemo,
} from 'react';
import {useEvent} from '@legoo/hooks';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none',
  {
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
  },
);

const textVariants = cva('text-base font-semibold text-center', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-primary',
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
  keyboardDismiss?: boolean;
  loading?: boolean;
  activityIndicatorClassName?: string;
}

const Button: ForwardRefRenderFunction<any, IButtonProps> = (props, ref) => {
  const {
    className,
    textClassName,
    children,
    variant,
    size,
    disabled = false,
    keyboardDismiss,
    loading = false,
    activityIndicatorClassName,
    onPress,
    ...rest
  } = props;
  const _disabled = useMemo(() => {
    return disabled || loading;
  }, [disabled, loading]);
  const _onPress = useEvent((event: GestureResponderEvent) => {
    onPress?.(event);
    keyboardDismiss && Keyboard.dismiss();
  });
  return (
    <Pressable
      ref={ref}
      disabled={_disabled}
      className={cx(
        buttonVariants({
          variant,
          size,
        }),
        {
          'opacity-50 pointer-events-none': disabled,
        },
        className,
      )}
      onPress={_onPress}
      {...rest}>
      {React.isValidElement(children) ? (
        children
      ) : (
        <View className="w-full">
          <Text
            className={cx(textVariants({variant, className: textClassName}))}>
            {children}
          </Text>
          {loading && (
            <View className="absolute right-2">
              <ActivityIndicator
                className={cx('text-white', activityIndicatorClassName)}
              />
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

Button.displayName = 'Button';

export default memo(forwardRef(Button));
