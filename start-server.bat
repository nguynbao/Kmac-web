@echo off
echo ============================================
echo   KMAC Tech - Local Development Server
echo   Design System v5.0 (#3B82F6)
echo ============================================
echo.
echo Starting server at http://localhost:3000
echo Press Ctrl+C to stop
echo.
cd /d "%~dp0"
python -m http.server 3000
pause
