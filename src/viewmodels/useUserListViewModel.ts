import { useState, useEffect, useCallback } from 'react';
import { AdminUserItem, AdminCreateUserRequest, AdminUpdateUserRequest, UserFilterParams } from '../models/user.types';
import { UserProfile, ProfileUpdateRequest } from '../models/profile.types';
import { userService } from '../services/user.service';
import { profileService } from '../services/profile.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useUserListViewModel() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  // Table Data
  const [rawUsers, setRawUsers] = useState<AdminUserItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingDetailProfile, setIsLoadingDetailProfile] = useState(false);

  // Add User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState<AdminCreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
    isActive: true,
    phoneNumber: '',
    gender: 'MALE',
    address: '',
    dateOfBirth: '',
  });

  // Edit / Update User Modal (Akun + Data Profil Personal)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState<{
    id: string;
    fullName: string;
    role: string;
    isActive: boolean;
    updatedAt?: string | null;
    phoneNumber: string;
    idCardNumber: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    bio: string;
    avatarUrl: string;
  }>({
    id: '',
    fullName: '',
    role: 'ROLE_USER',
    isActive: true,
    updatedAt: null,
    phoneNumber: '',
    idCardNumber: '',
    gender: 'MALE',
    dateOfBirth: '',
    address: '',
    bio: '',
    avatarUrl: '',
  });

  // Delete User Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);

  // Status Action In-Flight
  const [isTogglingStatusId, setIsTogglingStatusId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: UserFilterParams = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
        keyword: search.trim() || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        isActive: statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : undefined,
      };

      // 1. Fetch profiles to merge personal profile data with user accounts
      let profilesMap = new Map<string, UserProfile>();
      try {
        const profRes = await profileService.getProfiles({ page: 0, size: 100 });
        profRes.profiles.forEach((p) => {
          if (p.userId) profilesMap.set(p.userId, p);
          if (p.email) profilesMap.set(p.email.toLowerCase(), p);
        });
      } catch {
        // Continue if profiles cannot be batch fetched
      }

      try {
        // 2. Primary: Fetch /api/v1/users
        const response = await userService.getUsers(params);

        // Merge personal profile data for every user
        const merged: AdminUserItem[] = response.users.map((u) => {
          const prof = profilesMap.get(u.id) || profilesMap.get(u.email.toLowerCase());
          return {
            ...u,
            profileId: prof?.id,
            phoneNumber: prof?.phoneNumber || u.phoneNumber || null,
            idCardNumber: prof?.idCardNumber || u.idCardNumber || null,
            bio: prof?.bio || u.bio || null,
            avatarUrl: prof?.avatarUrl || u.avatarUrl || null,
            address: prof?.address || u.address || null,
            dateOfBirth: prof?.dateOfBirth || u.dateOfBirth || null,
            gender: prof?.gender || u.gender || null,
          };
        });

        setRawUsers(merged);
        setTotalElements(response.pagination.totalElements);
        setTotalPages(response.pagination.totalPages || 1);
      } catch {
        // 3. Fallback: If /api/v1/users is restricted, map from /api/v1/profiles directly
        const profResponse = await profileService.getProfiles({
          page: currentPage,
          size: pageSize,
          sortBy: sortBy === 'fullName' ? 'fullName' : 'createdAt',
          sortDir,
        });

        const mapped: AdminUserItem[] = profResponse.profiles.map((p) => ({
          id: p.userId || p.id,
          email: p.email,
          fullName: p.fullName || p.email,
          role: 'ROLE_USER',
          isActive: true,
          hasProfile: true,
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt,
          createdBy: 'Sistem',
          updatedBy: null,
          profileId: p.id,
          phoneNumber: p.phoneNumber || null,
          idCardNumber: p.idCardNumber || null,
          bio: p.bio || null,
          avatarUrl: p.avatarUrl || null,
          address: p.address || null,
          dateOfBirth: p.dateOfBirth || null,
          gender: p.gender || null,
        }));

        setRawUsers(mapped);
        setTotalElements(profResponse.pagination.totalElements);
        setTotalPages(profResponse.pagination.totalPages || 1);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat daftar pengguna.';
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, search, roleFilter, statusFilter, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Client-side search & filtering across both account data and personal profile data
  const filteredUsers = rawUsers.filter((u) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const matchName = u.fullName && u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email && u.email.toLowerCase().includes(q);
      const matchId = u.id && u.id.toLowerCase().includes(q);
      const matchPhone = u.phoneNumber && u.phoneNumber.toLowerCase().includes(q);
      const matchAddress = u.address && u.address.toLowerCase().includes(q);
      const matchKtp = u.idCardNumber && u.idCardNumber.toLowerCase().includes(q);

      if (!matchName && !matchEmail && !matchId && !matchPhone && !matchAddress && !matchKtp) {
        return false;
      }
    }

    if (roleFilter !== 'ALL' && u.role !== roleFilter) {
      return false;
    }

    if (statusFilter === 'ACTIVE' && !u.isActive) return false;
    if (statusFilter === 'INACTIVE' && u.isActive) return false;

    if (genderFilter !== 'ALL' && u.gender !== genderFilter) {
      return false;
    }

    return true;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(0, page - 1));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setCurrentPage(0);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(0);
    fetchUsers();
  };

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setGenderFilter('ALL');
    setCurrentPage(0);
    setSortBy('createdAt');
    setSortDir('desc');
  };

  // Open & Close View Detail Modal (Menampilkan Data Akun + Data Profil Personal)
  const openDetailModal = async (user: AdminUserItem) => {
    setSelectedUser(user);

    // Langsung buat profile object awal dari data yang sudah dimerge agar Data Profil Personal tidak kosong!
    const initialProfile: UserProfile = {
      id: user.profileId || user.id,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber || null,
      idCardNumber: user.idCardNumber || null,
      bio: user.bio || null,
      avatarUrl: user.avatarUrl || null,
      address: user.address || null,
      dateOfBirth: user.dateOfBirth || null,
      gender: (user.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    setSelectedUserProfile(initialProfile);
    setIsDetailModalOpen(true);

    setIsLoadingDetailProfile(true);
    try {
      if (user.id === currentUser?.userId) {
        const fresh = await profileService.getMyProfile();
        setSelectedUserProfile(fresh);
      } else {
        const fresh = await profileService.getProfileByUserId(user.id);
        setSelectedUserProfile(fresh);
      }
    } catch {
      // Pertahankan initialProfile yang sudah diisi dari data gabungan
    } finally {
      setIsLoadingDetailProfile(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedUser(null);
    setSelectedUserProfile(null);
    setIsDetailModalOpen(false);
  };

  // Add User Handlers (POST /api/v1/users)
  const openAddModal = () => {
    setAddUserForm({
      fullName: '',
      email: '',
      password: '',
      role: 'ROLE_USER',
      isActive: true,
      phoneNumber: '',
      gender: 'MALE',
      address: '',
      dateOfBirth: '',
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddUserChange = (field: keyof AdminCreateUserRequest, value: string | boolean) => {
    setAddUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = addUserForm.fullName.trim();
    const trimmedEmail = addUserForm.email.trim();
    const password = addUserForm.password;

    if (!trimmedName || !trimmedEmail || !password) {
      showToast('error', 'Semua kolom pembuatan akun wajib diisi.');
      return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      showToast('error', 'Nama lengkap harus antara 2 hingga 100 karakter.');
      return;
    }

    if (password.length < 8 || password.length > 100) {
      showToast('error', 'Kata sandi minimal 8 karakter.');
      return;
    }

    setIsAddingUser(true);
    try {
      await userService.createUser({
        fullName: trimmedName,
        email: trimmedEmail,
        password: password,
        role: addUserForm.role,
        isActive: addUserForm.isActive,
      });

      showToast('success', `Pengguna ${trimmedName} (${trimmedEmail}) berhasil dibuat.`, 'Akun Dibuat');
      setIsAddModalOpen(false);
      await fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat pengguna baru.';
      showToast('error', msg);
    } finally {
      setIsAddingUser(false);
    }
  };

  // Edit / Update User Handlers (PUT /api/v1/users/{userId} & Profil Personal)
  const openEditModal = (user: AdminUserItem) => {
    setEditUserForm({
      id: user.id,
      fullName: user.fullName || '',
      role: user.role || 'ROLE_USER',
      isActive: user.isActive,
      updatedAt: user.updatedAt,
      phoneNumber: user.phoneNumber || '',
      idCardNumber: user.idCardNumber || '',
      gender: user.gender || 'MALE',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditUserChange = (
    field: keyof typeof editUserForm,
    value: string | boolean
  ) => {
    setEditUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = editUserForm.fullName.trim();

    if (!trimmedName) {
      showToast('error', 'Nama lengkap tidak boleh kosong.');
      return;
    }

    setIsEditingUser(true);
    try {
      // 1. Update akun pengguna di backend
      const accountPayload: AdminUpdateUserRequest = {
        fullName: trimmedName,
        role: editUserForm.role,
        isActive: editUserForm.isActive,
      };
      await userService.updateUser(editUserForm.id, accountPayload);

      // 2. Pembaruan Data Profil Personal
      const profilePayload: ProfileUpdateRequest = {
        phoneNumber: editUserForm.phoneNumber.trim() || null,
        idCardNumber: editUserForm.idCardNumber.trim() || null,
        bio: editUserForm.bio.trim() || null,
        avatarUrl: editUserForm.avatarUrl.trim() || null,
        address: editUserForm.address.trim() || null,
        dateOfBirth: editUserForm.dateOfBirth.trim() || null,
        gender: (editUserForm.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
      };

      try {
        if (editUserForm.id === currentUser?.userId) {
          await profileService.updateMyProfile(profilePayload);
        } else {
          await profileService.updateProfileByUserId(editUserForm.id, profilePayload);
        }
      } catch (profErr) {
        console.info('Pembaruan data profil spesifik oleh admin:', profErr);
      }

      // Sinkronkan state lokal seketika agar perubahan langsung terlihat di tabel & detail
      setRawUsers((prev) =>
        prev.map((u) => {
          if (u.id === editUserForm.id) {
            return {
              ...u,
              fullName: trimmedName,
              role: editUserForm.role,
              isActive: editUserForm.isActive,
              phoneNumber: editUserForm.phoneNumber.trim() || null,
              idCardNumber: editUserForm.idCardNumber.trim() || null,
              bio: editUserForm.bio.trim() || null,
              avatarUrl: editUserForm.avatarUrl.trim() || null,
              address: editUserForm.address.trim() || null,
              dateOfBirth: editUserForm.dateOfBirth.trim() || null,
              gender: editUserForm.gender || null,
              updatedAt: new Date().toISOString(),
            };
          }
          return u;
        })
      );

      showToast('success', `Data akun dan profil ${trimmedName} berhasil diperbarui.`, 'Pembaruan Berhasil');
      setIsEditModalOpen(false);
      await fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui data pengguna.';
      showToast('error', msg);
    } finally {
      setIsEditingUser(false);
    }
  };

  // Toggle Status (Suspend / Activate) (PATCH /api/v1/users/{userId}/status)
  const handleToggleStatus = async (user: AdminUserItem) => {
    if (user.id === currentUser?.userId || user.email === currentUser?.email) {
      showToast('error', 'Administrator tidak dapat mengubah status aktif akunnya sendiri.');
      return;
    }

    setIsTogglingStatusId(user.id);
    const targetStatus = !user.isActive;

    try {
      await userService.updateUserStatus(user.id, targetStatus);
      showToast(
        'success',
        `Akun ${user.fullName} berhasil ${targetStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
        'Status Akun Berubah'
      );
      await fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah status akun.';
      showToast('error', msg);
    } finally {
      setIsTogglingStatusId(null);
    }
  };

  // Delete User Handlers (DELETE /api/v1/users/{userId})
  const openDeleteModal = (user: AdminUserItem) => {
    if (user.id === currentUser?.userId || user.email === currentUser?.email) {
      showToast('error', 'Administrator tidak dapat menghapus akunnya sendiri.');
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentUser?.userId || userToDelete.email === currentUser?.email) {
      showToast('error', 'Administrator tidak dapat menghapus akunnya sendiri.');
      return;
    }

    setIsDeletingUser(true);
    try {
      await userService.deleteUser(userToDelete.id);
      showToast('success', `Pengguna ${userToDelete.fullName} berhasil dihapus dari sistem.`, 'Penghapusan Berhasil');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus pengguna.';
      showToast('error', msg);
    } finally {
      setIsDeletingUser(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    try {
      const csv = userService.exportUsersToCSV(filteredUsers);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `accounthub_users_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'File CSV data pengguna berhasil diunduh.');
    } catch {
      showToast('error', 'Gagal mengekspor data CSV.');
    }
  };

  return {
    isAdmin,
    currentUserId: currentUser?.userId,
    users: filteredUsers,
    rawUsersCount: rawUsers.length,
    totalElements,
    totalPages,
    currentPage: currentPage + 1, // 1-based for UI pagination
    pageSize,
    sortBy,
    sortDir,
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
    setPageSize,
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
    refreshUsers: fetchUsers,
  };
}
