import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Brand & Feature Value Prop in Blue */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                <Shield className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Account<span className="text-blue-200">Hub</span>
                </span>
                <span className="block text-[10px] text-blue-200/80 font-medium tracking-wider uppercase">
                  Manajemen Akun Terpadu
                </span>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold tracking-tight leading-snug">
                Pengelolaan Akun Pengguna yang Praktis & Aman
              </h2>
              <p className="mt-3 text-sm text-blue-100/90 leading-relaxed">
                Kelola informasi akun, profil pengguna, dan hak akses organisasi Anda secara rapi dan terpusat dalam satu aplikasi modern.
              </p>

              <div className="mt-8 space-y-3.5">
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Antarmuka bersih, responsif, dan mudah digunakan</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Pengaturan tingkat hak akses akun yang teratur</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Keamanan dan privasi data pribadi selalu terjaga</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200/80">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Keamanan Terlindungi
            </span>
            <span>Versi 1.0</span>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6 flex justify-end">
            <span className="text-xs text-slate-500">
              {isLoginPage ? 'Belum punya akun?' : 'Sudah memiliki akun?'}
            </span>
            <Link
              to={isLoginPage ? '/register' : '/login'}
              className="ml-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {isLoginPage ? 'Daftar Sekarang' : 'Masuk di Sini'}
            </Link>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
