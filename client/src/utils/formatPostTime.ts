import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatPostTime = (date: string) => {
  const now = dayjs();
  const diffInMinutes = now.diff(dayjs(date), 'minute');
  const diffInHours = now.diff(dayjs(date), 'hour');
  const diffInDays = now.diff(dayjs(date), 'day');
  const diffInWeeks = now.diff(dayjs(date), 'week');
  const diffInMonths = now.diff(dayjs(date), 'month');
  const diffInYears = now.diff(dayjs(date), 'year');
  
  if (diffInMinutes < 1) return 'just now';
  else if (diffInMinutes < 60) return `${diffInMinutes}m`;
  else if (diffInHours < 24) return `${diffInHours}h`;
  else if (diffInDays < 30) return `${diffInDays}d`;
  else if (diffInWeeks < 5) return `${diffInWeeks}w`;
  else if (diffInMonths < 12) return `${diffInMonths}mo`;
  else return `${diffInYears}y`;
};



