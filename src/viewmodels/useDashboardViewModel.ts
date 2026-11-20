import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../models/profile.types';
import { profileService } from '../services/profile.service';

export interface DashboardMetrics {
  totalProfiles: number;
  completedProfiles: number;
  maleCount: number;
  femaleCount: number;
  otherCount: number;
  unsetGenderCount: number;
  recentProfiles: UserProfile[];
}

export function useDashboardViewModel() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProfiles: 0,
    completedProfiles: 0,
    maleCount: 0,
    femaleCount: 0,
    otherCount: 0,
    unsetGenderCount: 0,
    recentProfiles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await profileService.getProfiles({
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      const list = response.profiles;
      const total = response.pagination.totalElements || list.length;

      let male = 0;
      let female = 0;
      let other = 0;
      let unset = 0;
      let completed = 0;

      list.forEach((p) => {
        if (p.gender === 'MALE') male++;
        else if (p.gender === 'FEMALE') female++;
        else if (p.gender === 'OTHER') other++;
        else unset++;

        if (p.phoneNumber && p.address) {
          completed++;
        }
      });

      setMetrics({
        totalProfiles: total,
        completedProfiles: completed,
        maleCount: male,
        femaleCount: female,
        otherCount: other,
        unsetGenderCount: unset,
        recentProfiles: list.slice(0, 6),
      });
    } catch (e) {
      console.warn('Failed to load dashboard metrics from backend:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return {
    metrics,
    isLoading,
    refreshMetrics: loadMetrics,
  };
}
