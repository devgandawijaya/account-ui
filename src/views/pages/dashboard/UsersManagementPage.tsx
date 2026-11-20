import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  Search, 
  Filter, 
  RotateCcw,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  User as UserIcon,
  Loader2,
  RefreshCw,
  UserPlus,
  Mail,
  Lock,
  Edit3,
  Trash2,
  Power,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Link as LinkIcon
} from 'lucide-react';
import { useUserListViewModel } from '../../../viewmodels/useUserListViewModel';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { RoleBadge, StatusBadge, GenderBadge } from '../../components/common/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { formatDate, formatDateTime } from '../../../utils/formatters';

export const UsersManagementPage: React.FC = () => {
  const {
    currentUserId,
    users,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    search,
    roleFilter,
    statusFilter,
    genderFilter,
    isLoading,
    selectedUser,
    selectedUserProfile,
    isDetailModalOpen,
    isLoadingDetailProfile,
    isAddModalOpen,
    isAddingUser,
    addUserForm,
    isEditModalOpen,
    isEditingUser,
    editUserForm,
    isDeleteModalOpen,
    isDeletingUser,
    userToDelete,
    isTogglingStatusId,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setGenderFilter,
    handlePageChange,
    handleSort,
    handleSearchSubmit,
    resetFilters,
    openDetailModal,
    closeDetailModal,
    openAddModal,
    closeAddModal,
    handleAddUserChange,
    handleCreateUser,
    openEditModal,
    closeEditModal,
    handleEditUserChange,
    handleUpdateUser,
    handleToggleStatus,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    handleExportCSV,
    refreshUsers,
  } = useUserListViewModel();

  const [showAddPassword, setShowAddPassword] = useState(false);

  const roleOptions = [
    { value: 'ALL', label: 'Semua Peran' },
    { value: 'ROLE_ADMIN', label: 'Administrator' },
    { value: 'ROLE_USER', label: 'Pengguna Standar' },
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'ACTIVE', label: 'Aktif' },
    { value: 'INACTIVE', label: 'Dinonaktifkan' },
  ];

  const genderOptions = [
    { value: 'ALL', label: 'Semua Jenis Kelamin' },
    { value: 'MALE', label: 'Laki-laki' },
    { value: 'FEMALE', label: 'Perempuan' },
    { value: 'OTHER', label: 'Lainnya' },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Pengguna
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data akun pengguna, peran otorisasi, status keaktifan, dan profil data personal secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={refreshUsers}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
          >
            Muat Ulang
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5 text-slate-500" />}
          >
            Ekspor CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input with Instant & Manual Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            placeholder="Cari berdasarkan nama, email, nomor telepon, atau alamat..."
            className="w-full pl-9 pr-20 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Cari
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Jenis Kelamin */}
          <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5 px-1">
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Kelamin:</span>
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Filter Peran */}
          <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5 px-1 ml-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Peran:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Filter Status */}
          <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5 px-1 ml-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {(search || roleFilter !== 'ALL' || statusFilter !== 'ALL' || genderFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th
                  onClick={() => handleSort('fullName')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  Nama & Email
                </th>
                <th className="px-4 py-3.5">Profil Personal</th>
                <th className="px-4 py-3.5">Alamat Domisili</th>
                <th className="px-4 py-3.5">Peran & Status</th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  Tanggal Dibuat
                </th>
                <th
                  onClick={() => handleSort('updatedAt')}
                  className="px-4 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  Pembaruan Terakhir (Update Date)
                </th>
                <th className="px-4 py-3.5 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                    <UserIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">Tidak ada data pengguna yang cocok.</p>
                    <p className="text-[11px] mt-0.5">Sesuaikan kriteria pencarian atau saringan peran dan status.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  const isToggling = isTogglingStatusId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Kolom 1: Nama & Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={user.fullName || user.email}
                            avatarUrl={user.avatarUrl || undefined}
                            size="md"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {user.fullName || 'Nama Belum Diisi'}
                              </p>
                              {isSelf && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                                  Anda
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kolom 2: Profil Personal (Jenis Kelamin & No. Telepon) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <GenderBadge gender={user.gender} />
                          <div className="font-mono text-[11px] text-slate-700 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {user.phoneNumber || <span className="text-slate-300">-</span>}
                          </div>
                        </div>
                      </td>

                      {/* Kolom 3: Alamat Domisili */}
                      <td className="px-4 py-3.5 max-w-[180px] truncate text-slate-600">
                        {user.address ? (
                          <span title={user.address}>{user.address}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Kolom 4: Peran & Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <RoleBadge role={user.role} />
                          <StatusBadge isActive={user.isActive} />
                        </div>
                      </td>

                      {/* Kolom 5: Tanggal Dibuat (Created Date) */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <div>{formatDate(user.createdAt)}</div>
                        <div className="text-[10px] text-slate-400">
                          {formatDateTime(user.createdAt).split(', ')[1] || ''}
                        </div>
                      </td>

                      {/* Kolom 6: Pembaruan Terakhir (Update Date) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {user.updatedAt ? (
                          <div>
                            <div className="font-mono text-xs text-blue-700 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                              {formatDateTime(user.updatedAt)}
                            </div>
                            {user.updatedBy && (
                              <div className="text-[10px] text-slate-400">
                                Oleh: {user.updatedBy}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-500 font-medium">
                            Belum pernah diubah
                          </span>
                        )}
                      </td>

                      {/* Kolom 7: Aksi Manajemen */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Detail */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openDetailModal(user)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            title="Lihat Detail Profil Pengguna"
                          >
                            Detail
                          </Button>

                          {/* 2. Ubah / Update */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditModal(user)}
                            leftIcon={<Edit3 className="w-3.5 h-3.5 text-blue-600" />}
                            title="Ubah Data & Profil Pengguna (Update)"
                          >
                            Ubah
                          </Button>

                          {/* 3. Suspend / Aktifkan Toggle */}
                          <Button
                            variant={user.isActive ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                            disabled={isSelf || isToggling}
                            isLoading={isToggling}
                            leftIcon={<Power className="w-3.5 h-3.5" />}
                            title={
                              isSelf
                                ? 'Tidak dapat menonaktifkan akun sendiri'
                                : user.isActive
                                ? 'Nonaktifkan Akun (Suspend)'
                                : 'Aktifkan Kembali Akun'
                            }
                          >
                            {user.isActive ? 'Suspend' : 'Aktifkan'}
                          </Button>

                          {/* 4. Hapus / Delete */}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openDeleteModal(user)}
                            disabled={isSelf}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                            title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Pengguna (Delete)'}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: Detail Pengguna Lengkap                         */}
      {/* ======================================================== */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title="Rincian Informasi Pengguna"
        description="Detail akun sistem dan data profil personal pengguna."
        maxWidth="lg"
      >
        {selectedUser && (
          <div className="space-y-5">
            {/* Header Profil */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <Avatar
                name={selectedUser.fullName || selectedUser.email}
                avatarUrl={selectedUserProfile?.avatarUrl || selectedUser.avatarUrl || undefined}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedUser.fullName}
                  </h3>
                  <RoleBadge role={selectedUser.role} />
                </div>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge isActive={selectedUser.isActive} />
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {selectedUser.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Profil Personal */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                  Data Profil Personal
                </span>
                {isLoadingDetailProfile && (
                  <span className="text-[11px] text-blue-600 flex items-center gap-1 font-normal">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Menyinkronkan data...
                  </span>
                )}
              </h4>
              <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Nomor Telepon:</span>
                      <span className="font-medium text-slate-800">
                        {selectedUserProfile?.phoneNumber || selectedUser.phoneNumber || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Nomor KTP / Identitas:</span>
                      <span className="font-medium text-slate-800">
                        {selectedUserProfile?.idCardNumber || selectedUser.idCardNumber || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Jenis Kelamin:</span>
                    <GenderBadge gender={selectedUserProfile?.gender || selectedUser.gender} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Tanggal Lahir:</span>
                      <span className="font-medium text-slate-800">
                        {formatDate(selectedUserProfile?.dateOfBirth || selectedUser.dateOfBirth)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">Alamat Domisili:</span>
                      <span className="font-medium text-slate-800">
                        {selectedUserProfile?.address || selectedUser.address || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {(selectedUserProfile?.bio || selectedUser.bio) && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 block">Bio / Deskripsi Singkat:</span>
                    <p className="mt-0.5 text-slate-700 italic">
                      "{selectedUserProfile?.bio || selectedUser.bio}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Akun Sistem */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Data Akun Sistem & Audit
              </h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Dibuat:</span>
                  <span className="font-medium text-slate-800">
                    {formatDateTime(selectedUser.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dibuat Oleh:</span>
                  <span className="font-medium text-slate-800">
                    {selectedUser.createdBy || 'Sistem'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Diperbarui (Update Date):</span>
                  <span className="font-medium text-slate-800">
                    {selectedUser.updatedAt
                      ? formatDateTime(selectedUser.updatedAt)
                      : 'Belum pernah diubah (Nilai bawaan akun baru)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Terakhir Diperbarui Oleh:</span>
                  <span className="font-medium text-slate-800">
                    {selectedUser.updatedBy || 'Belum ada'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  closeDetailModal();
                  openEditModal(selectedUser);
                }}
                leftIcon={<Edit3 className="w-3.5 h-3.5 text-blue-600" />}
              >
                Ubah Profil Pengguna
              </Button>
              <Button variant="secondary" size="sm" onClick={closeDetailModal}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: Tambah Pengguna Baru (POST /api/v1/users)       */}
      {/* ======================================================== */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Tambah Pengguna Baru"
        description="Buat akun pengguna baru dengan menetapkan peran dan status aktif secara langsung."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={addUserForm.fullName}
            onChange={(e) => handleAddUserChange('fullName', e.target.value)}
            placeholder="John Doe"
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="Alamat Email"
            type="email"
            value={addUserForm.email}
            onChange={(e) => handleAddUserChange('email', e.target.value)}
            placeholder="john.doe@enterprise.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="relative">
            <Input
              label="Kata Sandi Awal"
              type={showAddPassword ? 'text' : 'password'}
              value={addUserForm.password}
              onChange={(e) => handleAddUserChange('password', e.target.value)}
              placeholder="Minimal 8 karakter"
              leftIcon={<Lock className="w-4 h-4" />}
              helperText="Minimal 8 karakter aman."
              required
            />
            <button
              type="button"
              onClick={() => setShowAddPassword(!showAddPassword)}
              className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showAddPassword ? <CheckCircle2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Peran Otorisasi (Role)"
              value={addUserForm.role}
              onChange={(e) => handleAddUserChange('role', e.target.value)}
              options={[
                { value: 'ROLE_USER', label: 'Pengguna Standar' },
                { value: 'ROLE_ADMIN', label: 'Administrator' },
              ]}
            />

            <Select
              label="Status Akun"
              value={addUserForm.isActive ? 'true' : 'false'}
              onChange={(e) => handleAddUserChange('isActive', e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Aktif' },
                { value: 'false', label: 'Dinonaktifkan' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={closeAddModal}
              disabled={isAddingUser}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isAddingUser}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Simpan Pengguna Baru
            </Button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: Ubah Data Pengguna & Profil Personal            */}
      {/* ======================================================== */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Ubah Data Pengguna & Profil Personal"
        description="Perbarui informasi akun, peran otorisasi, status keaktifan, dan data profil personal."
        maxWidth="lg"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          {/* Status Tanggal Pembaruan (Update Date Status) */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Tanggal Pembaruan Terakhir (Update Date):
              </span>
              <span className="font-mono font-medium">
                {editUserForm.updatedAt ? formatDateTime(editUserForm.updatedAt) : 'Belum pernah diubah'}
              </span>
            </div>
            <p className="text-[11px] text-blue-600/90 mt-1">
              Setelah perubahan disimpan, backend otomatis menetapkan tanggal pembaruan (Update Date) ke waktu saat ini.
            </p>
          </div>

          {/* Bagian 1: Data Akun & Hak Akses */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              1. Data Akun & Hak Akses
            </h4>
            <Input
              label="Nama Lengkap"
              value={editUserForm.fullName}
              onChange={(e) => handleEditUserChange('fullName', e.target.value)}
              placeholder="John Doe"
              leftIcon={<UserIcon className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Peran Otorisasi (Role)"
                value={editUserForm.role}
                onChange={(e) => handleEditUserChange('role', e.target.value)}
                options={[
                  { value: 'ROLE_USER', label: 'Pengguna Standar' },
                  { value: 'ROLE_ADMIN', label: 'Administrator' },
                ]}
              />

              <Select
                label="Status Keaktifan Akun"
                value={editUserForm.isActive ? 'true' : 'false'}
                onChange={(e) => handleEditUserChange('isActive', e.target.value === 'true')}
                options={[
                  { value: 'true', label: 'Aktif' },
                  { value: 'false', label: 'Dinonaktifkan' },
                ]}
              />
            </div>
          </div>

          {/* Bagian 2: Data Profil Personal */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-blue-600" />
              2. Data Profil Personal
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nomor Telepon"
                value={editUserForm.phoneNumber}
                onChange={(e) => handleEditUserChange('phoneNumber', e.target.value)}
                placeholder="+6281234567890"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Nomor KTP / Identitas Resmi"
                value={editUserForm.idCardNumber}
                onChange={(e) => handleEditUserChange('idCardNumber', e.target.value)}
                placeholder="3171012345670001"
                leftIcon={<CreditCard className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Jenis Kelamin"
                value={editUserForm.gender}
                onChange={(e) => handleEditUserChange('gender', e.target.value)}
                options={[
                  { value: 'MALE', label: 'Laki-laki' },
                  { value: 'FEMALE', label: 'Perempuan' },
                  { value: 'OTHER', label: 'Lainnya' },
                ]}
              />

              <Input
                label="Tanggal Lahir"
                type="date"
                value={editUserForm.dateOfBirth}
                onChange={(e) => handleEditUserChange('dateOfBirth', e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Tautan Foto Profil"
              value={editUserForm.avatarUrl}
              onChange={(e) => handleEditUserChange('avatarUrl', e.target.value)}
              placeholder="https://contoh-gambar.com/foto.jpg"
              leftIcon={<LinkIcon className="w-4 h-4" />}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Domisili
              </label>
              <textarea
                value={editUserForm.address}
                onChange={(e) => handleEditUserChange('address', e.target.value)}
                rows={2}
                placeholder="Jl. Sudirman Kav. 52-53, Jakarta Selatan"
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bio / Deskripsi Singkat
              </label>
              <textarea
                value={editUserForm.bio}
                onChange={(e) => handleEditUserChange('bio', e.target.value)}
                rows={2}
                placeholder="Ceritakan ringkasan keahlian atau peran profesional..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={closeEditModal}
              disabled={isEditingUser}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isEditingUser}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 4: Hapus Pengguna (DELETE /api/v1/users/{userId})  */}
      {/* ======================================================== */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus Pengguna (Delete)"
        description="Tindakan ini permanen dan menghapus akun beserta data profil terkait dari sistem."
      >
        {userToDelete && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Peringatan Penghapusan Akun</p>
                <p className="mt-1 text-rose-800 leading-relaxed">
                  Menghapus akun <strong>{userToDelete.fullName}</strong> ({userToDelete.email}) akan menghapus seluruh data autentikasi dan data profil terkait secara permanen (*cascade*).
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus akun pengguna ini sekarang?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={closeDeleteModal}
                disabled={isDeletingUser}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                isLoading={isDeletingUser}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Hapus Pengguna Sekarang
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
