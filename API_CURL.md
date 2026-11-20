# Panduan API & Koleksi cURL - Account Service

Dokumentasi ini ditujukan untuk **Tim Frontend (FE)** sebagai panduan integrasi lengkap dengan backend **Account Service**.

---

## 1. Konfigurasi Dasar (Environment)

| Variabel | Nilai Default Lokal | Deskripsi |
|---|---|---|
| **Base URL** | `http://localhost:8085` | URL root API service |
| **API Version** | `/api/v1` | Prefix versi endpoint |
| **Swagger UI** | [http://localhost:8085/swagger-ui.html](http://localhost:8085/swagger-ui.html) | Dokumentasi interaktif Swagger |
| **OpenAPI Docs** | [http://localhost:8085/v3/api-docs](http://localhost:8085/v3/api-docs) | Spesifikasi OpenAPI JSON v3 |
| **Healthcheck** | `http://localhost:8085/actuator/health` | Status kesehatan service backend |

---

## 2. Standar Request & Response

### 2.1 Header Standar
Untuk endpoint yang membutuhkan autentikasi:
```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
```

### 2.2 Struktur Standar Response Sukses (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Pesan status operasi",
  "data": { ... },
  "errors": null,
  "pagination": null,
  "timestamp": "2026-11-19T07:45:00Z"
}
```

### 2.3 Struktur Response Error
```json
{
  "success": false,
  "message": "Permintaan tidak dapat diproses karena kegagalan validasi input.",
  "data": null,
  "errors": [
    "email: Format email tidak valid."
  ],
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

## 3. Alur Autentikasi Frontend (Quick Guide)

1. **Registrasi Akun Baru** (`POST /api/v1/auth/register`) atau **Login** (`POST /api/v1/auth/login`).
2. Simpan `accessToken` dan `refreshToken` di secure storage FE (misal: HTTP-only cookie atau securely managed in-memory/state store).
3. Untuk setiap request ke endpoint berotentikasi, sertakan header:
   `Authorization: Bearer <accessToken>`
4. Jika halaman di-refresh, FE dapat memanggil `GET /api/v1/auth/me` untuk memulihkan state user dan mendapatkan token terbaru.

---

## 4. Modul Autentikasi (`/api/v1/auth`)

### 4.1 Registrasi Pengguna Baru

- **Method / Endpoint:** `POST /api/v1/auth/register`
- **Otorisasi:** Public (Tanpa Token)
- **Aturan Validasi Input:**
  - `email`: Wajib diisi, format email valid.
  - `password`: Wajib diisi, panjang antara 8 - 100 karakter.
  - `fullName`: Wajib diisi, panjang antara 2 - 100 karakter.

#### Perintah cURL:
```bash
curl -X POST "http://localhost:8085/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@enterprise.com",
    "password": "P@ssw0rdSecure!"
  }'
```

#### Contoh Response (`201 Created`):
```json
{
  "success": true,
  "message": "Registrasi pengguna berhasil diselesaikan.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "role": "ROLE_USER"
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 4.2 Login Pengguna

- **Method / Endpoint:** `POST /api/v1/auth/login`
- **Otorisasi:** Public (Tanpa Token)
- **Aturan Validasi Input:**
  - `email`: Wajib diisi, format email valid.
  - `password`: Wajib diisi.

#### Perintah cURL:
```bash
curl -X POST "http://localhost:8085/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@enterprise.com",
    "password": "P@ssw0rdSecure!"
  }'
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Autentikasi berhasil. Selamat datang kembali.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "role": "ROLE_USER"
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 4.3 Ambil Informasi Akun yang Sedang Login

- **Method / Endpoint:** `GET /api/v1/auth/me`
- **Otorisasi:** Bearer Token

#### Perintah cURL:
```bash
curl -X GET "http://localhost:8085/api/v1/auth/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Data profil pengguna berhasil diambil.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "role": "ROLE_USER"
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 4.4 Ganti Kata Sandi Akun Sendiri

- **Method / Endpoint:** `PUT /api/v1/auth/change-password` (atau `PUT /api/v1/users/me/password`)
- **Otorisasi:** Bearer Token

#### Perintah cURL:
```bash
curl -X PUT "http://localhost:8085/api/v1/auth/change-password" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "P@ssw0rdSecure!",
    "newPassword": "NewP@ssw0rdSecure2026!",
    "confirmPassword": "NewP@ssw0rdSecure2026!"
  }'
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Kata sandi berhasil diperbarui.",
  "data": null,
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

## 5. Modul Profil Pengguna (`/api/v1/profiles`)

### 5.1 Ambil Profil Akun yang Sedang Login

- **Method / Endpoint:** `GET /api/v1/profiles/me`
- **Otorisasi:** Bearer Token

#### Perintah cURL:
```bash
curl -X GET "http://localhost:8085/api/v1/profiles/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Data profil pengguna berhasil diambil.",
  "data": {
    "id": "a2b3c4d5-e6f7-4890-abcd-1234567890ab",
    "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "phoneNumber": "+6281234567890",
    "idCardNumber": "3171012345670001",
    "bio": "Senior Software Architect with passion in Cloud Native systems.",
    "avatarUrl": "https://cdn.enterprise.com/avatars/user-123.jpg",
    "address": "Jl. Sudirman Kav. 52-53, Jakarta Selatan",
    "dateOfBirth": "1992-05-15",
    "gender": "MALE",
    "createdAt": "2026-11-17T09:00:00Z",
    "updatedAt": "2026-11-17T09:30:00Z"
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 5.2 Perbarui Profil Akun yang Sedang Login

- **Method / Endpoint:** `PUT /api/v1/profiles/me`
- **Otorisasi:** Bearer Token
- **Aturan Validasi Input:**
  - `phoneNumber`: String 10–15 digit numerik, opsional awalan `+` (regex: `^\+?[0-9]{10,15}$`).
  - `idCardNumber`: Maksimal 50 karakter.
  - `bio`: Maksimal 500 karakter.
  - `avatarUrl`: Maksimal 1024 karakter.
  - `address`: Maksimal 255 karakter.
  - `dateOfBirth`: Tanggal format `YYYY-MM-DD` (harus tanggal lampau).
  - `gender`: Enum (`"MALE"`, `"FEMALE"`, `"OTHER"`).
- **Catatan:** Field sensitif (`phoneNumber`, `idCardNumber`, `address`) otomatis dienkripsi dengan AES-256 pada level database backend. FE mengirim & menerima data dalam bentuk plaintext.

#### Perintah cURL:
```bash
curl -X PUT "http://localhost:8085/api/v1/profiles/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+6281234567890",
    "idCardNumber": "3171012345670001",
    "bio": "Senior Software Architect with passion in Cloud Native systems.",
    "avatarUrl": "https://cdn.enterprise.com/avatars/user-123.jpg",
    "address": "Jl. Sudirman Kav. 52-53, Jakarta Selatan",
    "dateOfBirth": "1992-05-15",
    "gender": "MALE"
  }'
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Data profil pengguna berhasil diperbarui.",
  "data": {
    "id": "a2b3c4d5-e6f7-4890-abcd-1234567890ab",
    "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "phoneNumber": "+6281234567890",
    "idCardNumber": "3171012345670001",
    "bio": "Senior Software Architect with passion in Cloud Native systems.",
    "avatarUrl": "https://cdn.enterprise.com/avatars/user-123.jpg",
    "address": "Jl. Sudirman Kav. 52-53, Jakarta Selatan",
    "dateOfBirth": "1992-05-15",
    "gender": "MALE",
    "createdAt": "2026-11-17T09:00:00Z",
    "updatedAt": "2026-11-19T07:45:00Z"
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 5.3 Ambil Profil Berdasarkan User ID

- **Method / Endpoint:** `GET /api/v1/profiles/{userId}`
- **Otorisasi:** Bearer Token
- **Path Parameter:** `userId` (UUID pengguna)

#### Perintah cURL:
```bash
curl -X GET "http://localhost:8085/api/v1/profiles/c8f5d0a1-4321-4f9e-9d21-729901198f12" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Data profil pengguna berhasil diambil.",
  "data": {
    "id": "a2b3c4d5-e6f7-4890-abcd-1234567890ab",
    "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "phoneNumber": "+6281234567890",
    "idCardNumber": "3171012345670001",
    "bio": "Senior Software Architect",
    "avatarUrl": "https://cdn.enterprise.com/avatars/user-123.jpg",
    "address": "Jl. Sudirman Kav. 52-53, Jakarta Selatan",
    "dateOfBirth": "1992-05-15",
    "gender": "MALE",
    "createdAt": "2026-11-17T09:00:00Z",
    "updatedAt": "2026-11-17T09:30:00Z"
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 5.4 Ambil Daftar Profil Pengguna (Paginasi & Sorting)

- **Method / Endpoint:** `GET /api/v1/profiles`
- **Otorisasi:** Bearer Token
- **Query Parameters:**
  - `page` *(int, default: 0)*: Indeks halaman (dimulai dari 0).
  - `size` *(int, default: 10)*: Jumlah item per halaman.
  - `sortBy` *(string, default: createdAt)*: Field acuan pengurutan (`createdAt`, `updatedAt`, `id`).
  - `sortDir` *(string, default: desc)*: Arah sortir (`asc` atau `desc`).

#### Perintah cURL:
```bash
curl -X GET "http://localhost:8085/api/v1/profiles?page=0&size=10&sortBy=createdAt&sortDir=desc" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Daftar profil pengguna berhasil diambil.",
  "data": [
    {
      "id": "a2b3c4d5-e6f7-4890-abcd-1234567890ab",
      "userId": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
      "email": "john.doe@enterprise.com",
      "fullName": "John Doe",
      "phoneNumber": "+6281234567890",
      "idCardNumber": "3171012345670001",
      "bio": "Senior Software Architect",
      "avatarUrl": "https://cdn.enterprise.com/avatars/user-123.jpg",
      "address": "Jl. Sudirman Kav. 52-53, Jakarta Selatan",
      "dateOfBirth": "1992-05-15",
      "gender": "MALE",
      "createdAt": "2026-11-17T09:00:00Z",
      "updatedAt": "2026-11-17T09:30:00Z"
    }
  ],
  "pagination": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "isLast": true
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

## 6. Modul Manajemen Pengguna (`/api/v1/users`)

> **Catatan Kredensial Administrator Bawaan:**
> Saat aplikasi dijalankan pertama kali, backend otomatis menginisialisasi akun administrator default:
> - **Email:** `admin@enterprise.com`
> - **Password:** `P@ssw0rdAdmin!`
> - **Role:** `ROLE_ADMIN`

### 6.1 Daftar Seluruh Pengguna (Admin Only)

- **Method / Endpoint:** `GET /api/v1/users`
- **Otorisasi:** Bearer Token (`ROLE_ADMIN`)
- **Query Parameters:**
  - `page` *(int, default: 0)*: Indeks halaman.
  - `size` *(int, default: 10)*: Jumlah elemen per halaman.
  - `sortBy` *(string, default: "createdAt")*: Kolom sorting (`createdAt`, `fullName`, `email`).
  - `sortDir` *(string, default: "desc")*: Arah sortir (`asc` atau `desc`).
  - `keyword` *(string, opsional)*: Pencarian nama atau email.
  - `role` *(string, opsional)*: Filter peran (`ROLE_USER` atau `ROLE_ADMIN`).
  - `isActive` *(boolean, opsional)*: Filter status (`true` atau `false`).

#### Perintah cURL:
```bash
curl -X GET "http://localhost:8085/api/v1/users?page=0&size=10&keyword=john&role=ROLE_USER&isActive=true" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Daftar pengguna berhasil diambil.",
  "data": [
    {
      "id": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
      "email": "john.doe@enterprise.com",
      "fullName": "John Doe",
      "role": "ROLE_USER",
      "isActive": true,
      "hasProfile": true,
      "createdAt": "2026-11-17T09:00:00Z",
      "updatedAt": "2026-11-17T09:30:00Z",
      "createdBy": "SYSTEM",
      "updatedBy": "admin@enterprise.com"
    }
  ],
  "pagination": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "isLast": true
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 6.2 Ambil Rincian Pengguna Berdasarkan ID (Admin Only)

- **Method / Endpoint:** `GET /api/v1/users/{userId}`
- **Otorisasi:** Bearer Token (`ROLE_ADMIN`)

#### Perintah cURL:
```bash
curl -X GET "http://localhost:8085/api/v1/users/c8f5d0a1-4321-4f9e-9d21-729901198f12" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Data pengguna berhasil diambil.",
  "data": {
    "id": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "John Doe",
    "role": "ROLE_USER",
    "isActive": true,
    "hasProfile": true,
    "createdAt": "2026-11-17T09:00:00Z",
    "updatedAt": "2026-11-17T09:30:00Z",
    "createdBy": "SYSTEM",
    "updatedBy": null
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 6.3 Buat Pengguna Baru oleh Administrator (Admin Only)

- **Method / Endpoint:** `POST /api/v1/users`
- **Otorisasi:** Bearer Token (`ROLE_ADMIN`)
- **Deskripsi:** Admin membuat user langsung dengan menentukan role (`ROLE_ADMIN` atau `ROLE_USER`) dan status `isActive`. Entri profil default otomatis dibuatkan.

#### Perintah cURL:
```bash
curl -X POST "http://localhost:8085/api/v1/users" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane.smith@enterprise.com",
    "password": "P@ssw0rdSecure!",
    "role": "ROLE_ADMIN",
    "isActive": true
  }'
```

#### Contoh Response (`201 Created`):
```json
{
  "success": true,
  "message": "Pengguna baru berhasil dibuat.",
  "data": {
    "id": "e4f2c1b8-9876-4321-bb54-123456789abc",
    "email": "jane.smith@enterprise.com",
    "fullName": "Jane Smith",
    "role": "ROLE_ADMIN",
    "isActive": true,
    "hasProfile": true,
    "createdAt": "2026-11-19T07:45:00Z",
    "updatedAt": null,
    "createdBy": "admin@enterprise.com",
    "updatedBy": null
  },
  "timestamp": "2026-11-19T07:45:00Z"
}
```

---

### 6.4 Perbarui Data Akun Pengguna (Admin Only)

- **Method / Endpoint:** `PUT /api/v1/users/{userId}`
- **Otorisasi:** Bearer Token (`ROLE_ADMIN`)

#### Perintah cURL:
```bash
curl -X PUT "http://localhost:8085/api/v1/users/c8f5d0a1-4321-4f9e-9d21-729901198f12" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Johnathan Doe",
    "role": "ROLE_ADMIN",
    "isActive": true
  }'
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Data pengguna berhasil diperbarui.",
  "data": {
    "id": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "Johnathan Doe",
    "role": "ROLE_ADMIN",
    "isActive": true,
    "hasProfile": true,
    "createdAt": "2026-11-17T09:00:00Z",
    "updatedAt": "2026-11-19T07:50:00Z",
    "createdBy": "SYSTEM",
    "updatedBy": "admin@enterprise.com"
  },
  "timestamp": "2026-11-19T07:50:00Z"
}
```

---

### 6.5 Ubah Status Aktif / Suspend Pengguna (Admin Only)

- **Method / Endpoint:** `PATCH /api/v1/users/{userId}/status`
- **Otorisasi:** Bearer Token (`ROLE_ADMIN`)
- **Catatan:** Administrator tidak dapat menonaktifkan akunnya sendiri.

#### Perintah cURL:
```bash
curl -X PATCH "http://localhost:8085/api/v1/users/c8f5d0a1-4321-4f9e-9d21-729901198f12/status" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Status akun pengguna berhasil diperbarui.",
  "data": {
    "id": "c8f5d0a1-4321-4f9e-9d21-729901198f12",
    "email": "john.doe@enterprise.com",
    "fullName": "Johnathan Doe",
    "role": "ROLE_USER",
    "isActive": false,
    "hasProfile": true,
    "createdAt": "2026-11-17T09:00:00Z",
    "updatedAt": "2026-11-19T07:52:00Z",
    "createdBy": "SYSTEM",
    "updatedBy": "admin@enterprise.com"
  },
  "timestamp": "2026-11-19T07:52:00Z"
}
```

---

### 6.6 Hapus Pengguna (Admin Only)

- **Method / Endpoint:** `DELETE /api/v1/users/{userId}`
- **Otorisasi:** Bearer Token (`ROLE_ADMIN`)
- **Deskripsi:** Menghapus data akun pengguna secara permanen. Data profil terkait otomatis dihapus (*Cascade*). Administrator tidak dapat menghapus akunnya sendiri.

#### Perintah cURL:
```bash
curl -X DELETE "http://localhost:8085/api/v1/users/c8f5d0a1-4321-4f9e-9d21-729901198f12" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Pengguna berhasil dihapus dari sistem.",
  "data": null,
  "timestamp": "2026-11-19T07:55:00Z"
}
```

---

### 6.7 Nonaktifkan Akun Sendiri (Self-Deactivate)

- **Method / Endpoint:** `DELETE /api/v1/users/me`
- **Otorisasi:** Bearer Token (Semua Pengguna Terautentikasi)

#### Perintah cURL:
```bash
curl -X DELETE "http://localhost:8085/api/v1/users/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### Contoh Response (`200 OK`):
```json
{
  "success": true,
  "message": "Akun Anda berhasil dinonaktifkan.",
  "data": null,
  "timestamp": "2026-11-19T07:55:00Z"
}
```

---

## 7. Referensi Kode Error HTTP (Untuk Error Handling FE)

| Status Code | Kondisi Penyebab | Struktur Respon Contoh |
|---|---|---|
| `400 Bad Request` | Gagal validasi data form / request body | `{"success": false, "message": "...", "errors": ["email: Format email tidak valid."]}` |
| `401 Unauthorized` | Token hilang, format salah, atau expired | `{"success": false, "message": "Akses tidak diizinkan. Silakan login terlebih dahulu."}` |
| `403 Forbidden` | Token valid tapi role user tidak memiliki izin | `{"success": false, "message": "Akses ditolak..."}` |
| `404 Not Found` | Data user / profil dengan ID tersebut tidak ada | `{"success": false, "message": "Data profil pengguna tidak ditemukan."}` |
| `409 Conflict` | Email sudah terdaftar saat registrasi | `{"success": false, "message": "Email yang Anda masukkan sudah terdaftar dalam sistem."}` |
| `500 Server Error` | Kesalahan internal server | `{"success": false, "message": "Terjadi kesalahan internal pada server..."}` |

---

## 8. Nilai Enum & Format Data

- **Gender (`gender`):**
  - `"MALE"`
  - `"FEMALE"`
  - `"OTHER"`
- **Role (`role`):**
  - `"ROLE_USER"`
  - `"ROLE_ADMIN"`
- **Format Tanggal Lahir (`dateOfBirth`):**
  - `YYYY-MM-DD` (contoh: `1995-12-31`)
- **Format Timestamp ISO-8601:**
  - UTC Instant format (contoh: `2026-11-19T07:45:00Z`)
