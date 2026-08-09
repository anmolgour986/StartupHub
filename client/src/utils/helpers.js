export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const initials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const STATUS_COLORS = {
  idea: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  building: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  launched: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  scaling: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
};

export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

export const APPLICATION_STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};
