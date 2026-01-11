@echo off
echo ========================================
echo 🚨 SISTEMA DE ALERTAS DE ROBOS - CÓRDOBA
echo ========================================
echo.
echo Iniciando monitor en tiempo real...
echo.

cd /d "%~dp0"
python monitor_robos.py

pause
