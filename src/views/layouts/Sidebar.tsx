import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  History, 
  Settings, 
  LogOut,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { RoleBadge } from '../components/common/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      to: '/dashboard',
      label: 'Beranda Ringkasan',
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: '/dashboard/users',
      label: 'Daftar Pengguna',
      icon: <Users className="w-4 h-4" />,
    },
    {
      to: '/dashboard/roles',
      label: 'Informasi Hak Akses',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      to: '/dashboard/activities',
      label: 'Riwayat Aktivitas',
      icon: <History className="w-4 h-4" />,
    },
    {
      to: '/dashboard/settings',
      label: 'Profil Saya',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
            {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Account<span className="text-blue-600">Hub</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider -mt-0.5">
                Manajemen Akun Terpadu
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

                <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </div>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="text-current">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

                {user && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/60">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={user.fullName} size="sm" status="online" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Keluar dari akun"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <RoleBadge role={user.role} />
                <span className="text-[10px] text-emerald-600 font-medium">Terhubung</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
