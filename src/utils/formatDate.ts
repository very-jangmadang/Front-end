export const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
  const day = date.getDate();

  return `${month}/${day}`;
};
