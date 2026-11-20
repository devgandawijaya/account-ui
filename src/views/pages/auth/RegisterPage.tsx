import React from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthViewModel } from '../../../viewmodels/useAuthViewModel';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { evaluatePasswordStrength } from '../../../utils/validators';

export const RegisterPage: React.FC = () => {
  const {
    registerForm,
    showPassword,
    setShowPassword,
    isSubmitting,
    errorMessage,
    handleRegisterChange,
    submitRegister,
  } = useAuthViewModel();

  const strength = evaluatePasswordStrength(registerForm.password);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Buat Akun Baru
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Lengkapi data diri Anda di bawah ini untuk memulai.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={submitRegister} className="space-y-4">
        <Input
          label="Nama Lengkap"
          type="text"
          name="fullName"
          value={registerForm.fullName}
          onChange={handleRegisterChange}
          placeholder="contoh: John Doe"
          required
          autoComplete="name"
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="Alamat Email"
          type="email"
          name="email"
          value={registerForm.email}
          onChange={handleRegisterChange}
          placeholder="john.doe@enterprise.com"
          required
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div>
          <Input
            label="Kata Sandi (Minimal 8 karakter)"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            placeholder="Minimal 8 karakter (kombinasi huruf & angka)"
            required
            autoComplete="new-password"
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
          {registerForm.password && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-full rounded-full transition-all ${
                      step <= strength.score ? strength.color : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{strength.label}</span>
            </div>
          )}
        </div>

        <Input
          label="Konfirmasi Kata Sandi"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={registerForm.confirmPassword}
          onChange={handleRegisterChange}
          placeholder="Ulangi kata sandi di atas"
          required
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-600">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={registerForm.agreeToTerms}
              onChange={handleRegisterChange}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span>
              Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi yang berlaku.
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full py-2.5 text-sm"
          >
            Daftarkan Akun
          </Button>
        </div>
      </form>
    </div>
  );
};
