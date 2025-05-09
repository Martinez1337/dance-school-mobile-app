import {fromZonedTime} from "date-fns-tz";

export const getDatesMonthInterval = (date) => {
  const dateFrom = fromZonedTime(date, 'UTC')
  // Устанавливаем dateFrom на начало месяца
  dateFrom.setUTCDate(1);
  dateFrom.setUTCHours(0, 0, 0, 0);

  const dateTo = new Date(dateFrom);
  // Устанавливаем dateTo на конец месяца
  dateTo.setUTCMonth(dateFrom.getUTCMonth() + 1);
  dateTo.setUTCDate(0);
  dateTo.setUTCHours(23, 59, 59, 999);

  const dateFromString = dateFrom.toISOString();
  const dateToString = dateTo.toISOString();

  return {dateFrom: dateFromString, dateTo: dateToString}
}