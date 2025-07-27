export const getFormatTime = (seconds: number): string => {
  const ONE_DAY = 86400;
  const ONE_HOUR = 3600;
  const ONE_MINUTE = 60;

  if (seconds > ONE_DAY) {
    const days = Math.floor(seconds / ONE_DAY);
    return `${days}일`;
  }

  const hours = Math.floor(seconds / ONE_HOUR);
  const minutes = Math.floor((seconds % ONE_HOUR) / ONE_MINUTE);
  const remainingSeconds = seconds % ONE_MINUTE;

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  }
  if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  }
  return `${remainingSeconds}초`;
};