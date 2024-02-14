import type {IItem} from '../picker/type';
import {
  IDateTimePickerProps,
  DateType,
  DateTypeLevel,
  IColumnsCascade,
} from './type';
import {isNil, removeNilField} from '@legoo/helper';
import {dateSub, getDateInfo, getDaysInMonth} from '@legoo/helper';
import {useEvent} from '@legoo/hooks';
import React, {useCallback, useMemo, useState} from 'react';

function generateOrderArray(max: number, offset: number = 0): IItem[] {
  return Array.from({length: max})
    .fill(undefined)
    .map((_, idx) => ({
      label: `${idx + offset}`,
      value: idx + offset,
    }));
}

export function useDateState(props: IDateTimePickerProps) {
  const {
    mode,
    initDate,
    columnsOrder = ['day', 'month', 'year', 'hour', 'minute'],
  } = props;

  const generateDateRecord = useCallback<
    (currDate: Date, type?: number) => Partial<Record<DateType, IItem[]>>
  >(
    (currDate: Date, type: number = Number.MAX_SAFE_INTEGER) => {
      if (mode === 'date') {
        const {
          minimumDate = dateSub(undefined, 100, 'y'),
          maximumDate = new Date(),
        } = props;
        if (currDate > maximumDate) currDate = maximumDate;
        if (currDate < minimumDate) currDate = maximumDate;
        const {
          day: maxDay,
          month: maxMonth,
          year: maxYear,
        } = getDateInfo(maximumDate);
        const {
          day: minDay,
          month: minMonth,
          year: minYear,
        } = getDateInfo(minimumDate);
        const {month, year} = getDateInfo(currDate);
        let monthArr, dayArr;
        if (year === minYear) {
          if (type > DateTypeLevel['month'])
            monthArr = generateOrderArray(minMonth, 1);
          if (type > DateTypeLevel['day']) {
            if (month === minMonth) {
              dayArr = generateOrderArray(minDay, 1);
            } else {
              dayArr = generateOrderArray(
                getDaysInMonth(`${year}-${month}`),
                1,
              );
            }
          }
        } else if (year === maxYear) {
          if (type > DateTypeLevel['month'])
            monthArr = generateOrderArray(maxMonth, 1);
          if (type > DateTypeLevel['day']) {
            if (month === maxMonth) {
              dayArr = generateOrderArray(maxDay, 1);
            } else {
              dayArr = generateOrderArray(
                getDaysInMonth(`${year}-${month}`),
                1,
              );
            }
          }
        } else {
          if (type > DateTypeLevel['month'])
            monthArr = generateOrderArray(12, 1);
          if (type > DateTypeLevel['day'])
            dayArr = generateOrderArray(getDaysInMonth(`${year}-${month}`), 1);
        }
        return {
          day: dayArr,
          month: monthArr,
          year:
            type > DateTypeLevel['year']
              ? generateOrderArray(maxYear - minYear, minYear + 1).reverse()
              : undefined,
        };
      } else if (mode === 'time') {
        return {
          hour: props.hourArray ?? generateOrderArray(24),
          minute: props.minuteArray ?? generateOrderArray(60, 1),
        };
      } else if (mode === 'year-month') {
        return {
          month: props.monthArray ?? generateOrderArray(12, 1),
          year:
            props.yearArray ??
            generateOrderArray(100, new Date().getFullYear() - 100).reverse(),
        };
      }
    },
    [props],
  );

  const datePropertyToDate = useEvent(
    (dateProperty: Record<DateType, number>) => {
      const {year, month, day} = dateProperty;
      return new Date(`${year}-${month}-${day}`);
    },
  );

  const _initDate = useMemo(() => {
    return initDate ?? new Date();
  }, [initDate]);

  const initDateProperty = useMemo(() => getDateInfo(_initDate), [_initDate]);

  const initDateRecord = useMemo(
    () => generateDateRecord(_initDate),
    [_initDate, generateDateRecord],
  );

  const [dateProperty, setDateProperty] =
    useState<Record<DateType, number>>(initDateProperty);

  const [dateRecord, setDateRecord] = useState(initDateRecord);

  const onColumnChange = useEvent((type: DateType, value: number) => {
    const newDateProperty = {...dateProperty, [type]: value};
    console.log('newDateProperty', type, newDateProperty);
    if (mode === 'date') {
      const newDate = datePropertyToDate(newDateProperty);
      console.log('newDate', newDate);
      const record = generateDateRecord(newDate, DateTypeLevel[type]);
      setDateRecord(prev => {
        return {...prev, ...removeNilField(record)};
      });
    }
    setDateProperty(newDateProperty);
  });

  const columns = useMemo(() => {
    const result: IColumnsCascade[] = [];
    const keys = Object.keys(dateRecord) as DateType[];
    keys.forEach(key => {
      const idx = columnsOrder.findIndex(ele => ele === key);
      result[idx] = {
        name: key,
        list: dateRecord[key],
        onChange: onColumnChange.bind(null, key),
      };
    });
    return result.filter(ele => !isNil(ele));
  }, [mode, dateRecord, columnsOrder]);

  const result = useMemo(() => {
    if (mode === 'date') {
      return datePropertyToDate(dateProperty);
    } else if (mode === 'time') {
      const {hour, minute} = dateProperty;
      return `${hour}:${minute}`;
    } else if (mode === 'year-month') {
      const {year, month} = dateProperty;
      return `${year}-${month}`;
    }
  }, [mode, dateProperty]);

  return {
    columns,
    result,
    initDateProperty,
  };
}
