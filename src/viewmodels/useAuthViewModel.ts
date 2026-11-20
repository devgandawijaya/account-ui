import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isValidEmail } from '../utils/validators';

export function useAuthViewModel() {
  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  // Submit Login to Real Backend
  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = loginForm.email.trim();
    const password = loginForm.password;

    if (!email || !password) {
      setErrorMessage('Silakan lengkapi email dan kata sandi.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      showToast('success', 'Autentikasi berhasil. Selamat datang kembali.', 'Login Berhasil');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.';
      setErrorMessage(msg);
      showToast('error', msg, 'Gagal Masuk');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Register to Real Backend
  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const fullName = registerForm.fullName.trim();
    const email = registerForm.email.trim();
    const password = registerForm.password;
    const confirmPassword = registerForm.confirmPassword;

    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      setErrorMessage('Nama lengkap wajib diisi (antara 2 - 100 karakter).');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (password.length < 8 || password.length > 100) {
      setErrorMessage('Kata sandi harus antara 8 - 100 karakter (sesuai standar backend).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!registerForm.agreeToTerms) {
      setErrorMessage('Anda harus menyetujui syarat & ketentuan layanan.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
      });
      showToast('success', 'Registrasi pengguna berhasil diselesaikan.', 'Pendaftaran Berhasil');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat pendaftaran.';
      setErrorMessage(msg);
      showToast('error', msg, 'Gagal Mendaftar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loginForm,
    registerForm,
    showPassword,
    setShowPassword,
    isSubmitting,
    errorMessage,
    isAuthenticated,
    handleLoginChange,
    handleRegisterChange,
    submitLogin,
    submitRegister,
  };
}
