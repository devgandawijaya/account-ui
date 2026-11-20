# AccountHub - Enterprise User Management & Identity Platform

Aplikasi antarmuka pengguna (*Frontend UI*) modern berbasis **React JS**, dibangun dengan arsitektur **Clean Code + MVVM (Model-View-ViewModel)**, palet warna elegan **Putih & Biru**, dan terhubung langsung ke **Backend API Asli (Spring Boot 3.3.x)** di `http://localhost:8085` tanpa data dummy dan tanpa nilai yang di-hardcode.

---

## 🎯 Fitur & Integrasi Backend Asli (No Dummy / No Hardcode)

Semua data dan otorisasi terhubung ke endpoint RESTful backend resmi:

### 1. Autentikasi Pengguna (`/api/v1/auth/*`)
- **Pendaftaran Akun (`POST /api/v1/auth/register`)**:
  - Mengirim payload: `{ "fullName": "...", "email": "...", "password": "..." }`.
  - Menerima token JWT (*accessToken*, *refreshToken*, *expiresIn*, *userId*, *role*).
  - Validasi keamanan: Password minimum 8 karakter, kalkulator kekuatan kata sandi visual.
- **Login Akun (`POST /api/v1/auth/login`)**:
  - Mengirim payload: `{ "email": "...", "password": "..." }`.
  - Menerima dan menyimpan token JWT Bearer ke dalam sesi aman.
- **Verifikasi Sesi (`GET /api/v1/auth/me`)**:
  - Validasi otomatis status sesi pengguna aktif menggunakan Bearer Token.

### 2. Manajemen & Direktori Profil (`/api/v1/profiles/*`)
- **Daftar Profil Pengguna dengan Paginasi (`GET /api/v1/profiles`)**:
  - Mengambil data profil asli dari database backend dengan parameter `page`, `size`, `sortBy`, dan `sortDir`.
  - Fitur pencarian real-time dan penyaringan jenis kelamin (*MALE, FEMALE, OTHER*).
  - Modal detail profil lengkap (`GET /api/v1/profiles/{userId}`).
  - Ekspor data profil asli ke format CSV spreadsheet.
- **Pengaturan & Edit Profil Saya (`GET & PUT /api/v1/profiles/me`)**:
  - Menampilkan profil pengguna yang sedang login.
  - Form pembaruan: nomor telepon, nomor KTP/identitas, alamat domisili, jenis kelamin, tanggal lahir, URL avatar, dan bio.
  - Data sensitif (telepon, KTP, alamat) disimpan secara terenkripsi AES-256 oleh backend.

### 3. Matriks Otorisasi Spring Security (`ROLE_USER`, `ROLE_ADMIN`)
- Peninjauan wewenang hak akses berbasis klaim peran (*role*) yang diterbitkan backend pada token JWT.

---

## 🏛️ Arsitektur: Clean Code + MVVM & Zero Hardcoding

Semua variabel dan endpoint dikonfigurasi melalui lingkungan (*environment variables*), tanpa ada URL atau data yang di-hardcode:

```
src/
├── config/
│   └── api.config.ts           # Konfigurasi terpusat membaca VITE_API_BASE_URL
│
├── models/                     # [M] MODEL: Kontrak Tipe & DTO Backend
│   ├── api.types.ts            # ApiResponse<T>, PageMetadata, ApiError
│   ├── auth.types.ts           # LoginRequest, RegisterRequest, AuthResponseData, AuthSession
│   ├── profile.types.ts        # UserProfile, ProfileUpdateRequest, ProfileFilterParams
│   └── user.types.ts           # AppUser, UserRole
│
├── services/                   # Lapisan Akses Data & Repositori API
│   ├── api/
│   │   ├── apiClient.ts        # HTTP Client (fetch, timeout, injection Bearer token, interceptor)
│   │   └── token.service.ts    # Enkapsulasi penyimpanan token JWT di LocalStorage
│   ├── auth.service.ts         # Integrasi endpoint /api/v1/auth/*
│   └── profile.service.ts      # Integrasi endpoint /api/v1/profiles/* dan ekspor CSV
│
├── viewmodels/                 # [VM] VIEWMODEL: Business Logic & State Custom Hooks
│   ├── useAuthViewModel.ts     # Validasi input login/register & penanganan error backend
│   ├── useUserListViewModel.ts # State paginasi server, filter, modal detail, dan ekspor CSV
│   ├── useDashboardViewModel.ts# Komputasi metrik demografi gender dari data backend real
│   ├── useProfileViewModel.ts  # State pengambilan & pembaruan data profil me (PUT)
│   ├── useRoleViewModel.ts     # Inspeksi wewenang klaim JWT Spring Security
│   └── useActivityViewModel.ts # Jejak aktivitas mutasi akun berdasarkan timestamp real
│
├── context/                    # Shared Session State
│   ├── AuthContext.tsx         # Manajemen sesi global & refresh user
│   └── ToastContext.tsx        # Sistem notifikasi Toast non-intrusif
│
├── utils/                      # Helper & Validator
│   ├── formatters.ts           # Format tanggal Indonesia, inisial nama, warna gender/role
│   └── validators.ts           # Validasi email RFC & kalkulator skor password
│
└── views/                      # [V] VIEW: Presentasi UI Murni
    ├── components/
    │   ├── common/             # Button, Input, Select, Modal, Badge, Card, Avatar
    │   └── ui/                 # StatCard, Pagination
    ├── layouts/                # MainLayout (Sidebar & Topbar), AuthLayout
    └── pages/                  # LoginPage, RegisterPage, Dashboard, Users, Roles, Audit, Settings
```

---

## ⚙️ Konfigurasi Environment (Bebas Hardcode)

Buat atau sesuaikan berkas `.env`:
```env
# URL Backend API Server (Spring Boot)
VITE_API_BASE_URL=http://localhost:8085
```

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Runner 1-File (Paling Praktis)
Klik dua kali file berikut atau jalankan melalui terminal:
```cmd
.\start.bat
```
*(atau untuk pengguna PowerShell: `.\start.ps1`)*

Skrip ini akan otomatis memeriksa status Docker Engine. Jika Docker aktif, skrip menawarkan pilihan eksekusi kontainer atau server lokal, lalu membuka browser ke **http://localhost:3000**.

---

### Opsi 2: Menggunakan Docker Compose
```bash
docker-compose up --build -d
```
Aplikasi dikompilasi ke dalam kontainer produksi Nginx Alpine ultra-ringan dengan reverse proxy `/api` otomatis.

---

### Opsi 3: Menjalankan Dev Server Lokal
1. Instal dependensi:
   ```bash
   pnpm install
   ```
2. Jalankan development server:
   ```bash
   pnpm run dev
   ```
3. Buka browser di **http://localhost:3000**
