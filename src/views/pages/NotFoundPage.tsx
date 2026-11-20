import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/90 p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Alamat atau rute yang Anda tuju tidak tersedia atau Anda belum memiliki hak akses untuk halaman tersebut.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};
