import {View, Text} from 'react-native';
import {cx} from 'class-variance-authority';
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
      className={cx(
        'rounded-lg border border-input bg-card text-card-foreground',
        className || 'w-[150px] h-[125px]',
      )}
      {...rest}>
      {isValidElement(children) ? (
        children
      ) : (
        <Text className={cx('text-card-foreground', textClassName)}>
          {children}
        </Text>
      )}
    </View>
  );
};
Card.displayName = 'Card';

export default memo(forwardRef(Card));
