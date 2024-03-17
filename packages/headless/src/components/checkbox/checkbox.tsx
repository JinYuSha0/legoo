import {Pressable, Text, View} from 'react-native';
import {Check} from 'lucide-react-native';
import {cx} from 'class-variance-authority';
import React, {useEffect, useState, isValidElement} from 'react';

export interface ICheckboxProps {
  checked?: boolean;
  onValueChange?: (value: Boolean) => void;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  defaultChecked?: boolean;
}

const Checkbox = (props: ICheckboxProps) => {
  const {
    checked,
    onValueChange,
    className,
    textClassName,
    children,
    disabled = false,
    defaultChecked = false,
  } = props;
  const [isCheck, setIsCheck] = useState(defaultChecked);
  useEffect(() => {
    setIsCheck(checked);
  }, [checked]);

  const checkClick = () => {
    setIsCheck(val => {
      onValueChange && onValueChange(!val);
      return !val;
    });
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={checkClick}
      className={cx('flex-row items-center', {
        'opacity-50 pointer-events-none': disabled,
      })}>
      <View
        className={cx(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          className,
        )}>
        <Text>{isCheck ? <Check className="w-4 h-4" /> : ''}</Text>
      </View>
      <View>
        {isValidElement(children) ? (
          children
        ) : (
          <Text className={cx('ml-1', textClassName)}>{children}</Text>
        )}
      </View>
    </Pressable>
  );
};

export default Checkbox;
