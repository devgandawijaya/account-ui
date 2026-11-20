import React from 'react';
import { getRoleBadgeConfig, getGenderBadgeConfig } from '../../../utils/formatters';

export const RoleBadge: React.FC<{ role?: string }> = ({ role }) => {
  const { label, bg, text, border } = getRoleBadgeConfig(role);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}>
      {label}
    </span>
  );
};

export const GenderBadge: React.FC<{ gender?: string | null }> = ({ gender }) => {
  const { label, bg, text, border } = getGenderBadgeConfig(gender);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${bg} ${text} ${border}`}>
      {label}
    </span>
  );
};

export const StatusBadge: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Aktif
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Dinonaktifkan
    </span>
  );
};
