import dayjs, {type ManipulateType} from 'dayjs';

export function getCurrYear() {
  return dayjs().year();
}

export function getCurrMonth() {
  return dayjs().month() + 1;
}

export function getCurrDay() {
  return dayjs().date();
}

export function getDateInfo(date: Date) {
  const _date = dayjs(date);
  return {
    year: _date.year(),
    month: _date.month() + 1,
    day: _date.date(),
    hour: _date.hour(),
    minute: _date.minute(),
  };
}

export function getDaysInMonth(date?: string | Date) {
  return dayjs(date).daysInMonth();
}

export function dateAdd(
  date: Date | undefined,
  value: number,
  unit: ManipulateType,
) {
  return dayjs(date).add(value, unit).toDate();
}

export function dateSub(
  date: Date | undefined,
  value: number,
  unit: ManipulateType,
) {
  return dayjs(date).subtract(value, unit).toDate();
}

export function dateFormat(date?: Date, template: string = 'DD/MM/YYYY') {
  return dayjs(date).format(template);
}

export function dateTimeFormat(
  date?: Date,
  template: string = 'DD/MM/YYYY HH:mm:ss',
) {
  return dayjs(date).format(template);
}
