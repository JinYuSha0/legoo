import dayjs, {type ManipulateType} from 'dayjs';

export function getCurrYear() {
  return new Date().getFullYear();
}

export function getCurrMonth() {
  return new Date().getMonth() + 1;
}

export function getCurrDay() {
  return new Date().getDate();
}

export function getToday() {
  const {year, month, day} = getDateInfo(new Date());
  return new Date(`${year}-${month}-${day}`);
}

export function getDateInfo(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
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
