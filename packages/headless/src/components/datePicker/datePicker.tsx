import type {IDateTimePickerProps} from './type';
import {View} from 'react-native';
import {useDateState} from './useDateState';
import {Picker} from '../picker';
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
  const {height, pickerProps, onChange} = props;
  const {cycle, clickable} = pickerProps ?? {};
  const {columns, result, initDateProperty} = useDateState(props);
  useEffect(() => {
    onChange(result as any);
  }, [result]);
  return (
    <View className="flex-row">
      {columns.map(col => (
        <View key={col.name} className="w-20">
          <Picker
            {...pickerProps}
            initialIndex={
              col.name === 'year' ? 0 : initDateProperty[col.name] - 1
            }
            cycle={cycle ?? true}
            clickable={clickable ?? true}
            data={col.list}
            height={height}
            onChange={col.onChange}
          />
        </View>
      ))}
    </View>
  );
};

export default memo(forwardRef(DatePicker));
