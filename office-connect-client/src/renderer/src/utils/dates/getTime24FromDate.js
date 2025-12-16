export function getTime24FromDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
