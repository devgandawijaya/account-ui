export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function evaluatePasswordStrength(password: string): {
  score: number;
  label: 'Sangat Lemah' | 'Lemah' | 'Cukup' | 'Kuat' | 'Sangat Kuat';
  color: string;
} {
  let score = 0;
  if (!password) return { score: 0, label: 'Sangat Lemah', color: 'bg-slate-200' };

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: 'Lemah', color: 'bg-rose-500' };
    case 2:
      return { score: 2, label: 'Cukup', color: 'bg-amber-500' };
    case 3:
      return { score: 3, label: 'Kuat', color: 'bg-blue-600' };
    case 4:
    default:
      return { score: 4, label: 'Sangat Kuat', color: 'bg-emerald-600' };
  }
}
