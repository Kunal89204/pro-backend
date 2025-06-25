import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set your timezone (optional)
const TIMEZONE = 'Asia/Kolkata';

export function formatPostTime(isoTime: string): string {
  const now = dayjs().tz(TIMEZONE);
  const time = dayjs(isoTime).tz(TIMEZONE);
  const diffInMinutes = now.diff(time, 'minute');
  const diffInHours = now.diff(time, 'hour');
  const diffInDays = now.diff(time, 'day');

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 3) return `${diffInDays} days ago`;

  return time.format('DD MMM YYYY');
}
