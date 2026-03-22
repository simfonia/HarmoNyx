@echo off
echo ==========================================
echo      HarmoNyx One-Click Build Script
echo ==========================================

echo.
echo [1/2] Building Frontend (UI)...
cd ui
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/2] Building Backend (Tauri)...
cd src-tauri
cargo tauri build
if %errorlevel% neq 0 (
    echo [ERROR] Tauri build failed!
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ==========================================
echo [SUCCESS] Build finished successfully!
echo Installer location: src-tauri\target\release\bundle\msi
echo ==========================================
pause
