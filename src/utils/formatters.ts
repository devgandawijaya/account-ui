export function formatDate(isoString?: string | null): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getRoleBadgeConfig(role?: string): { label: string; bg: string; text: string; border: string } {
  const normalized = (role || '').toUpperCase();
  if (normalized.includes('ADMIN')) {
    return {
      label: 'Administrator',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
    };
  }
  return {
    label: 'Pengguna',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  };
}

export function getGenderBadgeConfig(gender?: string | null): { label: string; bg: string; text: string; border: string } {
  switch (gender) {
    case 'MALE':
      return {
        label: 'Laki-laki',
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
      };
    case 'FEMALE':
      return {
        label: 'Perempuan',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    case 'OTHER':
      return {
        label: 'Lainnya',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
      };
    default:
      return {
        label: 'Belum Diatur',
        bg: 'bg-slate-50',
        text: 'text-slate-500',
        border: 'border-slate-200',
      };
  }
}
