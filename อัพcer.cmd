@echo off
chcp 65001 >nul
title Update Certificates
cls
node "%~dp0scripts\update-certs.js"
echo.
pause
