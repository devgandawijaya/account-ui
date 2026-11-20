@echo off
setlocal enabledelayedexpansion
title AccountHub - User Management Platform Runner

echo ====================================================================
echo               ACCOUNTHUB - USER MANAGEMENT PLATFORM                 
echo             React + Clean Code + MVVM + Docker Compose              
echo ====================================================================
echo.

echo [1/3] Memeriksa status ketersediaan Docker Engine...
docker info >nul 2>&1

if %errorlevel% equ 0 (
    echo [OK] Docker Engine terdeteksi aktif.
    echo.
    echo Pilihan metode eksekusi:
    echo   [1] Jalankan via Docker Compose (Container Nginx Production)
    echo   [2] Jalankan via Local Dev Server (Vite Live Reload)
    echo.
    set /p choice="Pilih mode [1/2] (Default 1): "
    if "!choice!"=="2" goto run_local
    goto run_docker
) else (
    echo [INFO] Docker Engine tidak sedang berjalan atau tidak terpasang.
    echo [INFO] Beralih otomatis menjalankan via Local Server...
    goto run_local
)

:run_docker
echo.
echo [2/3] Membangun dan menjalankan kontainer Docker Compose...
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo [PERINGATAN] Gagal menjalankan via docker-compose.
    echo [INFO] Beralih ke Local Dev Server...
    goto run_local
)
echo.
echo [3/3] Kontainer berhasil dijalankan!
echo [URL] Membuka browser ke http://localhost:3000 ...
start http://localhost:3000
echo.
echo ====================================================================
echo Aplikasi berjalan di: http://localhost:3000
echo Untuk menghentikan kontainer: docker-compose down
echo ====================================================================
pause
exit /b 0

:run_local
echo.
echo [2/3] Memeriksa paket dependensi...
if not exist "node_modules" (
    echo [INFO] Menginstal dependensi awal...
    call pnpm install || call npm install
)

echo.
echo [3/3] Menjalankan server aplikasi di port 3000...
echo [URL] Membuka browser ke http://localhost:3000 ...
start http://localhost:3000
call pnpm run dev || call npm run dev
pause
exit /b 0
