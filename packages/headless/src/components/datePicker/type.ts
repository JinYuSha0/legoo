import type {IItem, IPickerProps} from '../picker/type';

export type DateType = 'minute' | 'hour' | 'day' | 'month' | 'year';

export const DateTypeLevel: Record<DateType, number> = {
  minute: 1,
  hour: 2,
  day: 3,
  month: 4,
  year: 5,
};

interface BaseProps {
  height: number;
  mode?: 'date' | 'time' | 'year-month';
  initDate?: Date;
  pickerProps?: Omit<IPickerProps, 'data' | 'height' | 'onChange'>;
  columnsOrder?: DateType[];
}

export interface IDatePickerProps extends BaseProps {
  mode: 'date';
  minimumDate?: Date;
  maximumDate?: Date;
  onChange?: (date: Date) => void;
}

export interface ITimePickerProps extends BaseProps {
  mode: 'time';
  hourArray?: IItem[];
  minuteArray?: IItem[];
  onChange?: (time: string) => void;
}

export interface IYearMonthPickerProps extends BaseProps {
  mode: 'year-month';
  minimumDate?: Date;
  maximumDate?: Date;
  onChange?: (time: string) => void;
}

export type IDateTimePickerProps =
  | IDatePickerProps
  | ITimePickerProps
  | IYearMonthPickerProps;

export interface IColumnsCascade {
  name: DateType;
  list: IItem[];
  maxVelocity?: number;
  onChange?: (value: number) => void;
}
