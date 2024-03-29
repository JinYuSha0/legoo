import type {IItem} from '../picker/type';
import {
  BaseProps,
  IDateTimePickerProps,
  DateType,
  DateTypeLevel,
  IColumnsCascade,
  IDatePickerProps,
} from './type';
import {isNil, nextTick, removeNilField} from '@legoo/helper';
import {
  paddingLeft,
  dateSub,
  getDateInfo,
  getDaysInMonth,
  getToday,
} from '@legoo/helper';
import {useEvent} from '@legoo/hooks';
import React, {useCallback, useMemo, useState} from 'react';

function generateOrderArray(
  max: number,
  offset: number = 0,
  type: DateType,
  formatter: BaseProps['formatter'] = (value: string) => value,
): IItem[] {
  return Array.from({length: max})
    .fill(undefined)
    .map((_, idx) => ({
      label: formatter(paddingLeft(idx + offset, 2), type),
      value: idx + offset,
    }));
}

function judgePropertyInArrary(
  type: DateType,
  arr: IItem[] | undefined,
  dateProperty?: Record<DateType, number>,
) {
  if (isNil(dateProperty) || isNil(arr)) return true;
  const value = dateProperty[type];
  return arr.findIndex(ele => ele.value === value) > -1;
}

export function useDateState(props: IDateTimePickerProps) {
  const {
    mode,
    initDate,
    columnsOrder = ['day', 'month', 'year', 'hour', 'minute'],
    formatter,
  } = props;

  const boundary = useMemo(() => {
    if (mode === 'date' || mode === 'year-month') {
      const today = getToday();
      return {
        minimumDate: props.minimumDate ?? dateSub(today, 150, 'y'),
        maximumDate: props.maximumDate ?? today,
      };
    }
    return null;
  }, [
    mode,
    (props as IDatePickerProps).minimumDate,
    (props as IDatePickerProps).maximumDate,
  ]);

  const generateDateRecord = useCallback<
    (
      currDate: Date,
      type?: number,
      dateProperty?: Record<DateType, number>,
    ) => Partial<Record<DateType, IItem[]>>
  >(
    (currDate, type = Number.MAX_SAFE_INTEGER, dateProperty) => {
      if (mode === 'date' || mode === 'year-month') {
        const {minimumDate, maximumDate} = boundary;
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
        let monthArr: IItem[], dayArr: IItem[];
        if (year === minYear) {
          if (type > DateTypeLevel['month'])
            monthArr = generateOrderArray(minMonth, 1, 'month', formatter);
          if (
            mode === 'date' &&
            type > DateTypeLevel['day'] &&
            judgePropertyInArrary('month', monthArr, dateProperty)
          ) {
            if (month === minMonth) {
              dayArr = generateOrderArray(minDay, 1, 'day', formatter);
            } else {
              dayArr = generateOrderArray(
                getDaysInMonth(`${year}-${month}`),
                1,
                'day',
                formatter,
              );
            }
          }
        } else if (year === maxYear) {
          if (type > DateTypeLevel['month'])
            monthArr = generateOrderArray(maxMonth, 1, 'month', formatter);
          if (
            mode === 'date' &&
            type > DateTypeLevel['day'] &&
            judgePropertyInArrary('month', monthArr, dateProperty)
          ) {
            if (month === maxMonth) {
              dayArr = generateOrderArray(maxDay, 1, 'day', formatter);
            } else {
              dayArr = generateOrderArray(
                getDaysInMonth(`${year}-${month}`),
                1,
                'day',
                formatter,
              );
            }
          }
        } else {
          if (type > DateTypeLevel['month'])
            monthArr = generateOrderArray(12, 1, 'month', formatter);
          if (
            mode === 'date' &&
            type > DateTypeLevel['day'] &&
            judgePropertyInArrary('month', monthArr, dateProperty)
          )
            dayArr = generateOrderArray(
              getDaysInMonth(`${year}-${month}`),
              1,
              'day',
              formatter,
            );
        }
        return {
          day: dayArr,
          month: monthArr,
          year:
            type > DateTypeLevel['year']
              ? generateOrderArray(
                  maxYear - minYear,
                  minYear + 1,
                  'year',
                  formatter,
                ).reverse()
              : undefined,
        };
      } else if (mode === 'time') {
        return {
          hour: props.hourArray ?? generateOrderArray(24, 0, 'hour', formatter),
          minute:
            props.minuteArray ?? generateOrderArray(60, 0, 'minute', formatter),
        };
      }
    },
    [props],
  );

  const datePropertyToDate = useCallback(
    (dateProperty: Record<DateType, number>, hasDay: boolean = true) => {
      const {year, month, day} = dateProperty;
      if (hasDay) {
        return new Date(`${year}-${month}-${day}`);
      }
      return new Date(`${year}-${month}`);
    },
    [],
  );

  const _initDate = useMemo(() => {
    return initDate ?? new Date();
  }, [initDate]);

  const initDateProperty = useMemo(() => getDateInfo(_initDate), [_initDate]);

  const initDateRecord = useMemo(
    () => generateDateRecord(_initDate),
    [_initDate, generateDateRecord],
  );

  const initIndexes = useMemo<Record<DateType, number>>(() => {
    return {
      year: initDateRecord.year?.findIndex(
        item => item.value === initDateProperty.year,
      ),
      month: initDateProperty.month - 1,
      day: initDateProperty.day - 1,
      hour: initDateProperty.hour,
      minute: initDateProperty.minute,
    };
  }, [initDateProperty, initDateRecord]);

  const [dateProperty, setDateProperty] =
    useState<Record<DateType, number>>(initDateProperty);

  const [dateRecord, setDateRecord] = useState(initDateRecord);

  const onColumnChange = useEvent(async (type: DateType, value: number) => {
    let newDateProperty: Record<DateType, number>;
    setDateProperty(prev => {
      newDateProperty = {...prev, [type]: value};
      return newDateProperty;
    });
    await nextTick();
    if (mode === 'date' || mode === 'year-month') {
      const newDate = datePropertyToDate(newDateProperty, false);
      const record = generateDateRecord(
        newDate,
        DateTypeLevel[type],
        newDateProperty,
      );
      setDateRecord(prev => ({...prev, ...removeNilField(record)}));
    }
  });

  const columns = useMemo(() => {
    const result: IColumnsCascade[] = [];
    const keys = Object.keys(removeNilField(dateRecord)) as DateType[];
    keys.forEach(key => {
      const idx = columnsOrder.findIndex(ele => ele === key);
      result[idx] = {
        name: key,
        list: dateRecord[key],
        maxVelocity: dateRecord[key].length <= 31 ? 1600 : undefined,
        onChange: onColumnChange.bind(null, key),
      };
    });
    return result.filter(ele => !isNil(ele));
  }, [mode, dateRecord, columnsOrder]);

  const result = useMemo(() => {
    if (mode === 'date') {
      const date = datePropertyToDate(dateProperty);
      const {minimumDate, maximumDate} = boundary;
      if (date <= maximumDate && date >= minimumDate) return date;
    } else if (mode === 'time') {
      const {hour, minute} = dateProperty;
      return `${hour}:${minute}`;
    } else if (mode === 'year-month') {
      const {year, month} = dateProperty;
      return `${year}-${month}`;
    }
    return null;
  }, [mode, dateProperty]);

  return {
    columns,
    result,
    initIndexes,
  };
}
