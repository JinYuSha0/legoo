import {View, Text} from 'react-native';
import React, {memo} from 'react';
import clsx from 'clsx';

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
      className={clsx('w-full justify-center absolute left-0', className)}
      style={{
        top: top,
        height: itemHeight,
      }}>
      <Text className={clsx('text-foreground text-center', textClassName)}>
        {label}
      </Text>
    </View>
  );
};

export default memo(Item);
