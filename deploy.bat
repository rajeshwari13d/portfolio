@echo off
REM Rajeshwari Mali Portfolio - Windows Deployment Script

echo 🚀 Rajeshwari Mali Portfolio Deployment Script
echo ================================================

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="check" goto check
if "%1"=="test" goto test
if "%1"=="deploy" goto deploy
goto help

:help
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   check     - Run pre-deployment checks
echo   test      - Run local test server
echo   deploy    - Deploy to GitHub Pages
echo   help      - Show this help message
echo.
goto end

:check
echo 📋 Checking required files...
if not exist "index.html" echo ❌ Missing index.html && goto end
if not exist "style.css" echo ❌ Missing style.css && goto end
if not exist "script.js" echo ❌ Missing script.js && goto end
if not exist "README.md" echo ❌ Missing README.md && goto end
echo ✅ All required files present

echo 🖼️  Checking assets directory...
if not exist "assets" echo ❌ Assets directory not found && goto end
echo ⚠️  TODO: Replace placeholder files in assets directory
goto end

:test
echo 🌐 Starting local development server...
where python >nul 2>nul
if %errorlevel%==0 (
    echo 📡 Server running at http://localhost:8000
    echo Press Ctrl+C to stop
    python -m http.server 8000
) else (
    echo ❌ Python not found. Please install Python or use a different server
)
goto end

:deploy
echo 🚀 Deploying to GitHub Pages...
if not exist ".git" echo ❌ Not a Git repository. Initialize with: git init && goto end

echo 📤 Committing changes...
git add .
git commit -m "Deploy portfolio website - %date% %time%"

echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Deployed! Check your repository settings to enable GitHub Pages
goto end

:end
pause
