import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Save, 
  Loader2, 
  Lock, 
  Link as LinkIcon, 
  KeyRound, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  UserX
} from 'lucide-react';
import { useProfileViewModel } from '../../../viewmodels/useProfileViewModel';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { RoleBadge, GenderBadge } from '../../components/common/Badge';

export const SettingsProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    profile,
    formData,
    isLoading,
    isSaving,
    passwordForm,
    isChangingPassword,
    isDeactivateModalOpen,
    isDeactivating,
    handleChange,
    saveProfile,
    handlePasswordChange,
    savePassword,
    openDeactivateModal,
    closeDeactivateModal,
    handleSelfDeactivate,
  } = useProfileViewModel();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const genderOptions = [
    { value: 'MALE', label: 'Laki-laki' },
    { value: 'FEMALE', label: 'Perempuan' },
    { value: 'OTHER', label: 'Lainnya' },
  ];

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs">Memuat informasi profil akun...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan Akun & Profil
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi pribadi, ubah kata sandi, dan atur preferensi keamanan akun Anda.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
          <Avatar
            name={profile?.fullName || user?.fullName || 'Pengguna'}
            avatarUrl={formData.avatarUrl || profile?.avatarUrl || undefined}
            size="xl"
            status="online"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {profile?.fullName || user?.fullName}
              </h2>
              <RoleBadge role={user?.role} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{profile?.email || user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <GenderBadge gender={profile?.gender} />
              <span className="text-[11px] font-mono text-slate-400">
                ID Pengguna: {profile?.userId || user?.userId}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={saveProfile} className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Informasi Pribadi & Kontak
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              value={profile?.fullName || user?.fullName || ''}
              disabled
              leftIcon={<User className="w-4 h-4" />}
              helperText="Sesuai nama pendaftaran akun Anda."
            />

            <Input
              label="Alamat Email"
              value={profile?.email || user?.email || ''}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Alamat email utama akun Anda."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Telepon"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              placeholder="+6281234567890"
              leftIcon={<Phone className="w-4 h-4" />}
              helperText="Nomor telepon aktif (10-15 digit numerik)."
            />

            <Input
              label="Nomor KTP / Identitas Resmi"
              name="idCardNumber"
              value={formData.idCardNumber || ''}
              onChange={handleChange}
              placeholder="3171012345670001"
              leftIcon={<CreditCard className="w-4 h-4" />}
              helperText="Nomor KTP atau identitas kependudukan."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenis Kelamin"
              name="gender"
              value={formData.gender || 'MALE'}
              onChange={handleChange}
              options={genderOptions}
            />

            <Input
              label="Tanggal Lahir"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Tautan Foto Profil"
            name="avatarUrl"
            value={formData.avatarUrl || ''}
            onChange={handleChange}
            placeholder="https://contoh-gambar.com/foto.jpg"
            leftIcon={<LinkIcon className="w-4 h-4" />}
            helperText="Tautan alamat gambar publik avatar Anda."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Domisili
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={2}
                placeholder="Jl. Sudirman Kav. 52-53, Jakarta Selatan"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Alamat tempat tinggal resmi Anda saat ini.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tentang Saya
            </label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Ceritakan ringkasan keahlian atau peran profesional Anda..."
              className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <p className="font-semibold">Perlindungan Privasi Terenkripsi</p>
              <p className="text-blue-700/80 mt-0.5">
                Nomor kontak, nomor identitas kependudukan, dan alamat Anda dienkripsi menggunakan standar keamanan AES-256 pada pangkalan data untuk memastikan privasi Anda tetap aman.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Profil
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Card */}
      <Card>
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Ganti Kata Sandi
            </h2>
            <p className="text-xs text-slate-500">
              Pastikan Anda menggunakan kata sandi yang kuat dan tidak digunakan di layanan lain.
            </p>
          </div>
        </div>

        <form onSubmit={savePassword} className="mt-5 space-y-4">
          <div className="relative">
            <Input
              label="Kata Sandi Saat Ini"
              type={showOldPassword ? 'text' : 'password'}
              value={passwordForm.oldPassword}
              onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
              placeholder="Masukkan kata sandi lama Anda"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Kata Sandi Baru"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Minimal 8 karakter"
                leftIcon={<Lock className="w-4 h-4" />}
                helperText="Panjang 8 - 100 karakter."
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Konfirmasi Kata Sandi Baru"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Ulangi kata sandi baru"
                leftIcon={<Lock className="w-4 h-4" />}
                helperText="Harus sama dengan kata sandi baru."
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isChangingPassword}
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Perbarui Kata Sandi
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone: Self-Deactivate Account */}
      <Card className="border-rose-200 bg-rose-50/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-900">
                Nonaktifkan Akun
              </h2>
              <p className="text-xs text-rose-700/80 mt-0.5 max-w-xl">
                Setelah akun dinonaktifkan, Anda tidak akan dapat masuk ke sistem ini kembali sampai akun Anda diaktifkan kembali oleh administrator.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={openDeactivateModal}
            leftIcon={<UserX className="w-3.5 h-3.5" />}
          >
            Nonaktifkan Akun Saya
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal for Account Deactivation */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={closeDeactivateModal}
        title="Konfirmasi Penonaktifan Akun"
        description="Harap perhatikan konsekuensi dari tindakan ini."
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Peringatan Akses Akun</p>
              <p className="mt-1 text-amber-800 leading-relaxed">
                Tindakan ini akan menonaktifkan status akun Anda secara langsung. Sesi aktif Anda akan segera ditutup dan Anda akan dialihkan ke halaman masuk.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Apakah Anda yakin ingin melanjutkan penonaktifan akun ini sekarang?
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={closeDeactivateModal}
              disabled={isDeactivating}
            >
              Batalkan
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleSelfDeactivate(logout)}
              isLoading={isDeactivating}
              leftIcon={<UserX className="w-3.5 h-3.5" />}
            >
              Ya, Nonaktifkan Akun
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
