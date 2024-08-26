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

export const getLastSeen = (utcString: string): string => {
  const now = dayjs(); // Current local time
  const then = dayjs.utc(utcString).local(); // Convert UTC to local time
  const diff = now.diff(then, 'second');

  if (diff < 30) return 'Just now';
  if (diff < 60) return 'Less than a minute ago';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
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