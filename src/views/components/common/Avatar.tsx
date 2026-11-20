import React from 'react';
import { getInitials } from '../../../utils/formatters';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  avatarUrl,
  status,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base font-semibold',
  };

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const initials = getInitials(name);

  // Deterministic soft color based on name length
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-sky-100 text-sky-700 border-sky-200',
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-slate-100 text-slate-700 border-slate-200',
  ];
  const colorIndex = (name ? name.charCodeAt(0) : 0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className="relative inline-flex shrink-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover border border-slate-200 shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} ${colorClass} rounded-full flex items-center justify-center font-medium border select-none`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 ${dotSize[size]} rounded-full border-2 border-white ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'away'
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
