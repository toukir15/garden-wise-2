import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

export const formatRelativeTime = (time: any) => {
  const diffInSeconds = dayjs().diff(time, "second");
  if (diffInSeconds < 60) return `${diffInSeconds}s`;

  const diffInMinutes = dayjs().diff(time, "minute");
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = dayjs().diff(time, "hour");
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = dayjs().diff(time, "day");
  if (diffInDays < 7) return `${diffInDays}d`;

  const diffInWeeks = dayjs().diff(time, "week");
  if (diffInWeeks < 52) return `${diffInWeeks}w`;

  const diffInYears = dayjs().diff(time, "year");
  return `${diffInYears}y`;
};
