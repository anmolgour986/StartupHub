import { initials } from '../../utils/helpers';

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const COLORS = [
  'bg-brand-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-blue-500', 'bg-purple-500', 'bg-teal-500',
];

const colorFor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const Avatar = ({ user, size = 'md', online, className = '' }) => {
  const sizeClass = SIZES[size] || SIZES.md;
  const name = user?.name || '?';

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {user?.avatar ? (
        <img src={user.avatar} alt={name} className={`${sizeClass} rounded-full object-cover ring-2 ring-white dark:ring-gray-900`} />
      ) : (
        <div className={`${sizeClass} ${colorFor(name)} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-gray-900`}>
          {initials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${
            online ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
