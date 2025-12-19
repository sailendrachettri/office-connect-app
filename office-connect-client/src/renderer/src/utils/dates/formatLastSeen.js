export function formatLastSeen(isoString) {
  const lastSeenDate = new Date(isoString);
  const now = new Date();

  const diffMs = now - lastSeenDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Just now
  if (diffSeconds < 30) {
    return 'Just now';
  }

  // Minutes ago
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  }

  // Hours ago
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }

  // Yesterday
  if (diffDays === 1) {
    return `Yesterday at ${lastSeenDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  // Older dates
  return lastSeenDate.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ', ' +
  lastSeenDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
