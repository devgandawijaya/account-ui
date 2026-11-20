import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserCheck2, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useDashboardViewModel } from '../../../viewmodels/useDashboardViewModel';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { GenderBadge } from '../../components/common/Badge';
import { formatDateTime } from '../../../utils/formatters';

export const DashboardOverviewPage: React.FC = () => {
  const { metrics, isLoading, refreshMetrics } = useDashboardViewModel();
  const navigate = useNavigate();

  const total = metrics.totalProfiles || 1;
  const malePercent = Math.round((metrics.maleCount / total) * 100);
  const femalePercent = Math.round((metrics.femaleCount / total) * 100);
  const unsetPercent = Math.round((metrics.unsetGenderCount / total) * 100);

  return (
    <div className="space-y-6">
      {/* Header section with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ringkasan Pengguna & Akun
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Informasi terkini mengenai statistik pengguna dan kelengkapan data akun.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={refreshMetrics}
            leftIcon={<Activity className="w-3.5 h-3.5 text-slate-500" />}
          >
            Perbarui Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/users')}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            Kelola Pengguna
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics Cards (Real Backend Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengguna"
          value={isLoading ? '...' : metrics.totalProfiles}
          subtitle="pengguna terdaftar"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 'Aktif', isPositive: true, label: 'terdaftar' }}
          highlightColor="blue"
        />

        <StatCard
          title="Profil Lengkap"
          value={isLoading ? '...' : metrics.completedProfiles}
          subtitle={`(${metrics.totalProfiles ? Math.round((metrics.completedProfiles / metrics.totalProfiles) * 100) : 0}%)`}
          icon={<UserCheck className="w-5 h-5" />}
          trend={{ value: 'Lengkap', isPositive: true, label: 'telepon & domisili' }}
          highlightColor="emerald"
        />

        <StatCard
          title="Pengguna Laki-Laki"
          value={isLoading ? '...' : metrics.maleCount}
          subtitle="pengguna"
          icon={<UserCheck2 className="w-5 h-5" />}
          trend={{ value: `${malePercent}%`, isPositive: true, label: 'dari keseluruhan' }}
          highlightColor="blue"
        />

        <StatCard
          title="Pengguna Perempuan"
          value={isLoading ? '...' : metrics.femaleCount}
          subtitle="pengguna"
          icon={<Sparkles className="w-5 h-5" />}
          trend={{ value: `${femalePercent}%`, isPositive: true, label: 'dari keseluruhan' }}
          highlightColor="rose"
        />
      </div>

      {/* Middle row: Gender Distribution & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gender Breakdown */}
        <div className="lg:col-span-7">
          <Card
            title="Komposisi Jenis Kelamin"
            subtitle="Sebaran jenis kelamin pengguna yang telah melengkapi data profil"
            action={
              <button
                onClick={() => navigate('/dashboard/users')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Kelola Pengguna</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Laki-Laki</span>
                  <span className="text-slate-500 font-semibold">
                    {metrics.maleCount} pengguna ({malePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${malePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Perempuan</span>
                  <span className="text-slate-500 font-semibold">
                    {metrics.femaleCount} pengguna ({femalePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${femalePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Belum Diatur / Lainnya</span>
                  <span className="text-slate-500 font-semibold">
                    {metrics.unsetGenderCount + metrics.otherCount} pengguna ({unsetPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-slate-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${unsetPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Shortcuts */}
        <div className="lg:col-span-5">
          <Card title="Akses Cepat" subtitle="Navigasi ke menu utama yang sering digunakan">
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/dashboard/users')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Daftar Pengguna</p>
                    <p className="text-[11px] text-slate-500">Cari, saring, dan kelola akun pengguna</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/dashboard/settings')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Perbarui Profil Saya</p>
                    <p className="text-[11px] text-slate-500">Ubah nomor kontak, domisili, dan data diri</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/dashboard/roles')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Informasi Hak Akses</p>
                    <p className="text-[11px] text-slate-500">Pelajari wewenang dan izin akun Anda</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Profiles List */}
      <Card
        title="Pengguna Baru Bergabung"
        subtitle="Daftar akun yang baru saja terdaftar di platform"
        action={
          <button
            onClick={() => navigate('/dashboard/users')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        {metrics.recentProfiles.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">Belum ada pengguna yang terdaftar.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {metrics.recentProfiles.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={p.fullName} size="sm" avatarUrl={p.avatarUrl || undefined} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {p.fullName || 'Nama Belum Diisi'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{p.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GenderBadge gender={p.gender} />
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {formatDateTime(p.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
