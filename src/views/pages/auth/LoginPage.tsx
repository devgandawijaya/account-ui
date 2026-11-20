import React from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthViewModel } from '../../../viewmodels/useAuthViewModel';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const {
    loginForm,
    showPassword,
    setShowPassword,
    isSubmitting,
    errorMessage,
    handleLoginChange,
    submitLogin,
  } = useAuthViewModel();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke Akun
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Masukkan alamat email dan kata sandi Anda untuk melanjutkan.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={submitLogin} className="space-y-4">
        <Input
          label="Alamat Email"
          type="email"
          name="email"
          value={loginForm.email}
          onChange={handleLoginChange}
          placeholder="contoh: john.doe@enterprise.com"
          required
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div>
          <Input
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            placeholder="Masukkan kata sandi akun"
            required
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              checked={loginForm.rememberMe}
              onChange={handleLoginChange}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span>Ingat sesi saya</span>
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full py-2.5 text-sm"
          >
            Masuk
          </Button>
        </div>
      </form>
    </div>
  );
};
