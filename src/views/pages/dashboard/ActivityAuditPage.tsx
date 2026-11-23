import React from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  Info, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useActivityViewModel, AuditEvent } from '../../../viewmodels/useActivityViewModel';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatDateTime } from '../../../utils/formatters';

export const ActivityAuditPage: React.FC = () => {
  const {
    activities,
    isLoading,
    filterCategory,
    setFilterCategory,
    search,
    setSearch,
    refreshActivities,
  } = useActivityViewModel();

  const getSeverityBadge = (severity: AuditEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> Perhatian Khusus
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Peringatan
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3 h-3 text-blue-600" /> Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Riwayat Aktivitas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catatan aktivitas pendaftaran akun baru dan pembaruan informasi profil pengguna.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={refreshActivities}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Muat Ulang
        </Button>
      </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari riwayat berdasarkan nama pengguna atau keterangan..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5 px-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Kategori:</span>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="AUTH">Pendaftaran Akun</option>
            <option value="USER_MANAGEMENT">Pembaruan Profil</option>
            <option value="SECURITY">Keamanan Akun</option>
          </select>
        </div>
      </div>

            <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Jenis Aktivitas</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Memuat catatan aktivitas...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Belum ada catatan aktivitas yang sesuai.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDateTime(act.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {act.actor}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {act.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                      {act.details}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {getSeverityBadge(act.severity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
