import {View, Text} from 'react-native';
import clsx from 'clsx';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  ReactNode,
  isValidElement,
} from 'react';
export interface ICardProps {
  className?: string;
  textClassName?: string;
  children?: ReactNode;
}

const Card: ForwardRefRenderFunction<any, ICardProps> = (props, ref) => {
  const {className, textClassName, children, ...rest} = props;

  return (
    <View
      ref={ref}
      className={clsx(
        'rounded-lg border border-input bg-card text-card-foreground',
        className || 'w-[150px] h-[125px]',
      )}
      {...rest}>
      {isValidElement(children) ? (
        children
      ) : (
        <Text className={clsx('text-card-foreground', textClassName)}>
          {children}
        </Text>
      )}
    </View>
  );
};
Card.displayName = 'Card';

export default memo(forwardRef(Card));
