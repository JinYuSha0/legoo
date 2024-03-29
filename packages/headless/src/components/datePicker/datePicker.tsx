import type {IDateTimePickerProps} from './type';
import {View} from 'react-native';
import {useDateState} from './useDateState';
import {Picker} from '../picker';
import {isNil} from '@legoo/helper';
import {cx} from 'class-variance-authority';
import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  memo,
  useEffect,
} from 'react';

const DatePicker: ForwardRefRenderFunction<View, IDateTimePickerProps> = (
  props,
  ref,
) => {
  const {height, pickerProps, className, onChange} = props;
  const {cycle, clickable} = pickerProps ?? {};
  const {columns, result, initIndexes} = useDateState(props);
  useEffect(() => {
    if (!isNil(result) && onChange) {
      onChange(result as any);
    }
  }, [result]);
  return (
    <View className={cx('flex-row bg-background', className)}>
      {columns.map(col => (
        <View
          key={col.name}
          className={cx(columns.length === 3 ? 'w-1/3' : 'w-1/2')}>
          <Picker
            {...pickerProps}
            initialIndex={initIndexes[col.name]}
            height={height}
            cycle={cycle ?? true}
            clickable={clickable ?? true}
            data={col.list}
            maxVelocity={col.maxVelocity}
            onChange={col.onChange}
          />
        </View>
      ))}
    </View>
  );
};

export default memo(forwardRef(DatePicker));
