import {View, Text} from 'react-native';
import {cx} from 'class-variance-authority';
import React, {memo} from 'react';

export interface IItemProps {
  top: number;
  label: string;
  itemHeight: number;
  className?: string;
  textClassName?: string;
}

const Item: React.FC<IItemProps> = props => {
  const {top, label, itemHeight, className, textClassName} = props;
  return (
    <View
      className={cx('w-full justify-center absolute left-0', className)}
      style={{
        top: top,
        height: itemHeight,
      }}>
      <Text
        className={cx('text-base text-foreground text-center', textClassName)}>
        {label}
      </Text>
    </View>
  );
};

export default memo(Item);
