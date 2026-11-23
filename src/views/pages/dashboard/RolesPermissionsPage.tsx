import React from 'react';
import { 
  Check, 
  Users, 
  Lock
} from 'lucide-react';
import { useRoleViewModel } from '../../../viewmodels/useRoleViewModel';
import { Card } from '../../components/common/Card';
import { RoleBadge } from '../../components/common/Badge';

export const RolesPermissionsPage: React.FC = () => {
  const { 
    roles, 
    currentRole, 
    selectedRoleCode, 
    setSelectedRoleCode, 
    totalUsersCount,
    currentUserRole 
  } = useRoleViewModel();

  return (
    <div className="space-y-6">
            <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Informasi Hak Akses & Peran
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pelajari tingkatan wewenang dan cakupan hak akses yang berlaku dalam platform.
        </p>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => {
          const isSelected = selectedRoleCode === r.code;
          return (
            <div
              key={r.code}
              onClick={() => setSelectedRoleCode(r.code)}
              className={`p-5 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <RoleBadge role={r.code} />
                {r.isCurrentUserRole && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Peran Akun Anda
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{r.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {r.description}
              </p>
            </div>
          );
        })}
      </div>

            <Card
        title={`Cakupan Akses: ${currentRole.name}`}
        subtitle="Rincian hak akses dan fitur yang dapat digunakan oleh tingkatan peran ini."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Peran Akun Anda:</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
              {currentUserRole === 'ROLE_ADMIN' ? 'Administrator' : 'Pengguna Standar'}
            </span>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Rincian Wewenang & Izin</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {currentRole.authorities.map((auth, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="p-1 rounded bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{auth.split(':')[0]}</p>
                  <p className="text-slate-600 mt-0.5">{auth.split(':')[1]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" /> Total akun terdaftar:
            </span>
            <span className="font-bold text-slate-900">{totalUsersCount} Pengguna</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
