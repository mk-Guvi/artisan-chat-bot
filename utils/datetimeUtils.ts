import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

type DiffType = 'days' | 'months' | 'years' | 'hours' | 'minutes';

export const getDifferenceInDates = (
  endDate: Date,
  startDate: Date = new Date(),
  diffType: DiffType = 'minutes'
): number => dayjs(endDate).diff(dayjs(startDate), diffType);

export const getTimezone = (): string => dayjs.tz.guess();

export const formatUTCDate = (date: string, outputFormat: string): string => 
  dayjs.utc(date).tz(getTimezone()).format(outputFormat);

export const convertLocalDateToUTC = (
  localDate: string,
  inputFormat: string,
  outputFormat: string = 'YYYY-MM-DDTHH:mm:ss[Z]'
): string => dayjs(localDate, inputFormat).utc().format(outputFormat);

const TIME_UNITS = [
  { unit: 'year', limit: 525600, singular: 'year', plural: 'years' },
  { unit: 'week', limit: 10080, singular: 'week', plural: 'weeks' },
  { unit: 'day', limit: 1440, singular: 'day', plural: 'days' },
  { unit: 'hour', limit: 60, singular: 'hour', plural: 'hours' },
  { unit: 'minute', limit: 1, singular: 'minute', plural: 'minutes' }
] as const;
export const getLastSeen = (utcString: string): string => {
  const timeDifferenceMinutes = dayjs().diff(dayjs(utcString), 'minute');

  if (timeDifferenceMinutes < 1) return 'Just now';

  for (const { limit, singular, plural } of TIME_UNITS) {
    if (timeDifferenceMinutes < limit) {
      const value = Math.floor(timeDifferenceMinutes / (limit / 60));
      return `${value} ${value === 1 ? singular : plural} ago`;
    }
  }

  return 'Just now'; // Fallback
};
export const DateAndTimeFormats = {
  DATE: 'D MMMM YYYY',
  DATETIME: 'D MMMM YYYY, hh:mm a',
  TIME: 'h:mm a',
} as const;

export type DateAndTimeFormatsKeysT = keyof typeof DateAndTimeFormats;

export const getStartAndEndDate = (type: 'DAY' | 'MONTH' | 'WEEK') => {
  const now = dayjs();
  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;

  switch (type) {
    case 'DAY':
      startDate = now.subtract(24, 'hour');
      endDate = now;
      break;
    case 'WEEK':
      startDate = now.startOf('week');
      endDate = now.endOf('week');
      break;
    case 'MONTH':
      startDate = now.startOf('month');
      endDate = now.endOf('month');
      break;
  }

  return {
    startUTC: startDate.toISOString(),
    endUTC: endDate.toISOString(),
  };
};