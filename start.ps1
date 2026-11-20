# ====================================================================
#               ACCOUNTHUB - USER MANAGEMENT PLATFORM                 
#             React + Clean Code + MVVM + Docker Compose              
# ====================================================================

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "              ACCOUNTHUB - USER MANAGEMENT PLATFORM                 " -ForegroundColor White
Write-Host "            React + Clean Code + MVVM + Docker Compose              " -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Memeriksa status ketersediaan Docker Engine..." -ForegroundColor Yellow

$dockerRunning = $false
try {
    $null = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerRunning = $true
    }
} catch {
    $dockerRunning = $false
}

if ($dockerRunning) {
    Write-Host "[OK] Docker Engine terdeteksi aktif." -ForegroundColor Green
    Write-Host ""
    Write-Host "Pilihan mode eksekusi:" -ForegroundColor White
    Write-Host "  [1] Jalankan via Docker Compose (Nginx Container)" -ForegroundColor Gray
    Write-Host "  [2] Jalankan via Local Dev Server (Vite Live Reload)" -ForegroundColor Gray
    $choice = Read-Host "Pilih mode [1/2] (Default: 1)"

    if ($choice -ne "2") {
        Write-Host ""
        Write-Host "[2/3] Membangun dan menjalankan Docker Compose..." -ForegroundColor Yellow
        docker-compose up --build -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[3/3] Aplikasi berhasil berjalan dalam Docker container!" -ForegroundColor Green
            Write-Host "[URL] Membuka http://localhost:3000 ..." -ForegroundColor Cyan
            Start-Process "http://localhost:3000"
            Write-Host ""
            Write-Host "Aplikasi aktif di: http://localhost:3000" -ForegroundColor Green
            Write-Host "Untuk menghentikan kontainer: docker-compose down" -ForegroundColor Gray
            exit 0
        } else {
            Write-Host "[PERINGATAN] Gagal menjalankan via docker-compose. Beralih ke Local Server..." -ForegroundColor Red
        }
    }
} else {
    Write-Host "[INFO] Docker Engine tidak aktif. Menggunakan Local Server..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "[2/3] Memeriksa dependensi..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    pnpm install
}

Write-Host ""
Write-Host "[3/3] Menjalankan server aplikasi di http://localhost:3000 ..." -ForegroundColor Green
Start-Process "http://localhost:3000"
pnpm run dev
