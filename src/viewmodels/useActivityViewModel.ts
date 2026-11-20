import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profile.service';
import { userService } from '../services/user.service';
import { useAuth } from '../context/AuthContext';

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  category: 'AUTH' | 'USER_MANAGEMENT' | 'SECURITY';
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export function useActivityViewModel() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [activities, setActivities] = useState<AuditEvent[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const events: AuditEvent[] = [];

      if (isAdmin) {
        const response = await userService.getUsers({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
        response.users.forEach((u) => {
          // Pendaftaran akun event
          events.push({
            id: `user_reg_${u.id}`,
            actor: u.createdBy || 'Sistem Enterprise',
            action: 'Pendaftaran Akun Pengguna',
            category: 'AUTH',
            details: `Akun atas nama ${u.fullName} (${u.email}) berhasil didaftarkan dengan peran ${u.role === 'ROLE_ADMIN' ? 'Administrator' : 'Pengguna Standar'}.`,
            timestamp: u.createdAt,
            severity: 'info',
          });

          // Event status akun
          if (!u.isActive) {
            events.push({
              id: `user_status_${u.id}`,
              actor: u.updatedBy || 'Administrator',
              action: 'Penangguhan Akun (Suspend)',
              category: 'SECURITY',
              details: `Akun ${u.fullName} (${u.email}) dalam status dinonaktifkan sementara.`,
              timestamp: u.updatedAt || u.createdAt,
              severity: 'warning',
            });
          }

          // Pembaruan data jika updatedAt berbeda
          if (u.updatedAt && u.updatedAt !== u.createdAt) {
            events.push({
              id: `user_upd_${u.id}`,
              actor: u.updatedBy || u.fullName,
              action: 'Pembaruan Data Akun',
              category: 'USER_MANAGEMENT',
              details: `Perubahan data akun untuk ${u.fullName} tercatat di sistem.`,
              timestamp: u.updatedAt,
              severity: 'info',
            });
          }
        });
      } else {
        const response = await profileService.getProfiles({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
        response.profiles.forEach((p) => {
          events.push({
            id: `reg_${p.id}`,
            actor: p.fullName || p.email,
            action: 'Pendaftaran Akun Baru',
            category: 'AUTH',
            details: `Akun baru atas nama ${p.fullName || p.email} (${p.email}) berhasil didaftarkan.`,
            timestamp: p.createdAt,
            severity: 'info',
          });

          if (p.updatedAt && p.updatedAt !== p.createdAt) {
            events.push({
              id: `upd_${p.id}`,
              actor: p.fullName || p.email,
              action: 'Pembaruan Profil',
              category: 'USER_MANAGEMENT',
              details: `Informasi kontak dan domisili untuk ${p.fullName || p.email} berhasil diperbarui.`,
              timestamp: p.updatedAt,
              severity: 'info',
            });
          }
        });
      }

      // Urutkan berdasarkan waktu terkini
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(events);
    } catch (e) {
      console.warn('Gagal memuat catatan audit dari backend:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = activities.filter((act) => {
    const matchesCategory = filterCategory === 'ALL' || act.category === filterCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      act.actor.toLowerCase().includes(q) ||
      act.action.toLowerCase().includes(q) ||
      act.details.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return {
    activities: filteredActivities,
    isLoading,
    filterCategory,
    setFilterCategory,
    search,
    setSearch,
    refreshActivities: fetchActivities,
  };
}
