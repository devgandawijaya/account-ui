import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ProfileUpdateRequest } from '../models/profile.types';
import { ChangePasswordRequest } from '../models/auth.types';
import { profileService } from '../services/profile.service';
import { authService } from '../services/auth.service';
import { useToast } from '../context/ToastContext';

export function useProfileViewModel() {
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    phoneNumber: '',
    idCardNumber: '',
    bio: '',
    avatarUrl: '',
    address: '',
    dateOfBirth: '',
    gender: 'MALE',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Change Password State
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Deactivate Account State
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      setFormData({
        phoneNumber: data.phoneNumber || '',
        idCardNumber: data.idCardNumber || '',
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || '',
        address: data.address || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'MALE',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat profil pengguna.';
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations per backend rules in API_CURL.md
    if (formData.phoneNumber && formData.phoneNumber.trim() !== '') {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        showToast('error', 'Nomor telepon harus 10–15 digit numerik (opsional awalan +).');
        return;
      }
    }

    if (formData.idCardNumber && formData.idCardNumber.length > 50) {
      showToast('error', 'Nomor identitas / KTP maksimal 50 karakter.');
      return;
    }

    if (formData.bio && formData.bio.length > 500) {
      showToast('error', 'Bio / deskripsi singkat maksimal 500 karakter.');
      return;
    }

    if (formData.avatarUrl && formData.avatarUrl.length > 1024) {
      showToast('error', 'URL avatar maksimal 1024 karakter.');
      return;
    }

    if (formData.address && formData.address.length > 255) {
      showToast('error', 'Alamat maksimal 255 karakter.');
      return;
    }

    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const now = new Date();
      if (dob >= now) {
        showToast('error', 'Tanggal lahir harus merupakan tanggal lampau.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload: ProfileUpdateRequest = {
        phoneNumber: formData.phoneNumber?.trim() || null,
        idCardNumber: formData.idCardNumber?.trim() || null,
        bio: formData.bio?.trim() || null,
        avatarUrl: formData.avatarUrl?.trim() || null,
        address: formData.address?.trim() || null,
        dateOfBirth: formData.dateOfBirth?.trim() || null,
        gender: formData.gender || 'MALE',
      };

      const updated = await profileService.updateMyProfile(payload);
      setProfile(updated);
      showToast('success', 'Perubahan data profil Anda berhasil disimpan.', 'Profil Disimpan');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil.';
      showToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (field: keyof ChangePasswordRequest, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('error', 'Semua kolom kata sandi wajib diisi.');
      return;
    }

    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 100) {
      showToast('error', 'Kata sandi baru harus memiliki panjang antara 8 hingga 100 karakter.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      showToast('success', 'Kata sandi akun Anda berhasil diperbarui.', 'Pembaruan Berhasil');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui kata sandi.';
      showToast('error', msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openDeactivateModal = () => {
    setIsDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
  };

  const handleSelfDeactivate = async (onSuccessLogout: () => void) => {
    setIsDeactivating(true);
    try {
      await authService.selfDeactivate();
      showToast('info', 'Akun Anda telah dinonaktifkan.', 'Sesi Ditutup');
      setIsDeactivateModalOpen(false);
      onSuccessLogout();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menonaktifkan akun.';
      showToast('error', msg);
    } finally {
      setIsDeactivating(false);
    }
  };

  return {
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
    refreshProfile: fetchProfile,
  };
}
