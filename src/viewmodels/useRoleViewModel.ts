import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile.service';

export interface SystemRoleDetail {
  code: string;
  name: string;
  description: string;
  isCurrentUserRole: boolean;
  authorities: string[];
}

export function useRoleViewModel() {
  const { user } = useAuth();
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [selectedRoleCode, setSelectedRoleCode] = useState<string>('ROLE_USER');

  useEffect(() => {
    profileService
      .getProfiles({ page: 0, size: 1 })
      .then((res) => {
        setTotalUsersCount(res.pagination.totalElements || res.profiles.length);
      })
      .catch(() => {});
  }, []);

  const roles: SystemRoleDetail[] = [
    {
      code: 'ROLE_USER',
      name: 'Pengguna Standar',
      description:
        'Pengguna terdaftar dengan hak akses untuk mengelola data profil pribadi, mengganti kata sandi, dan menonaktifkan akun secara mandiri.',
      isCurrentUserRole: user?.role === 'ROLE_USER',
      authorities: [
        'Profil Pribadi: Melihat dan memperbarui rincian data profil akun sendiri (kontak, alamat, KTP)',
        'Ganti Kata Sandi: Memperbarui kata sandi akun secara mandiri dan aman',
        'Penonaktifan Mandiri: Menonaktifkan akun pribadi jika tidak lagi digunakan',
        'Daftar Direktori: Melihat daftar akun pengguna yang terdaftar di platform',
        'Rincian Pengguna: Melihat informasi profil dasar pengguna lain',
      ],
    },
    {
      code: 'ROLE_ADMIN',
      name: 'Administrator',
      description:
        'Tingkat kewenangan tertinggi untuk tata kelola pengguna, penugasan peran, status keaktifan akun, dan keamanan sistem.',
      isCurrentUserRole: user?.role === 'ROLE_ADMIN',
      authorities: [
        'Hak Akses Penuh: Mencakup seluruh hak akses pengguna standar',
        'Manajemen Akun Terpadu: Menambah pengguna baru dengan menentukan peran dan status awal',
        'Ubah Data & Peran: Memperbarui nama lengkap dan mengubah peran (Role) pengguna',
        'Kontrol Status Akun: Mengaktifkan kembali atau menangguhkan (Suspend) akun pengguna',
        'Penghapusan Permanen: Menghapus data akun pengguna beserta profil terkait secara bersih',
        'Penyaringan Tingkat Lanjut: Menyaring data pengguna berdasarkan peran, status aktif, dan kata kunci',
      ],
    },
  ];

  const currentRole = roles.find((r) => r.code === selectedRoleCode) || roles[0];

  return {
    roles,
    currentRole,
    selectedRoleCode,
    setSelectedRoleCode,
    totalUsersCount,
    currentUserRole: user?.role || 'ROLE_USER',
  };
}
