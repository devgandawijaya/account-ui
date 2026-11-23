import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, User as UserIcon, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { Avatar } from '../components/common/Avatar';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [backendHealth, setBackendHealth] = useState<string>('CHECKING');

  useEffect(() => {
    authService
      .checkHealth()
      .then((res) => setBackendHealth(res.status))
      .catch(() => setBackendHealth('DOWN'));
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              backendHealth === 'UP' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span>{backendHealth === 'UP' ? 'Layanan Terhubung' : 'Menghubungkan ke Layanan...'}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Sistem Berjalan Baik</span>
        </div>
      </div>

            <div className="flex items-center gap-2.5">
                <button
          onClick={() => navigate('/dashboard/users')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Cari pengguna...</span>
        </button>

                <div className="relative">
          <button
            onClick={() => setShowNotificationList(!showNotificationList)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="Pemberitahuan"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotificationList && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Pemberitahuan</span>
                <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">
                  Tandai sudah dibaca
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-100">
                  <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Koneksi Layanan Aktif</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Seluruh fitur dan pembaruan data telah tersinkronisasi dengan aman.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Sesi Pengguna Aman</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1 truncate">
                    Akun: <span className="font-medium text-slate-700">{user?.email}</span>
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    Tingkat akses: <span className="font-medium text-slate-600">{user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Pengguna Standar'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

                {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Avatar name={user.fullName} size="sm" />
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-slate-900 block leading-tight">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Pengguna Standar'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{user.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => navigate('/dashboard/settings')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profil Saya</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/roles')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hak Akses Akun</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
