@echo off
setlocal

REM ==== CONFIG ====
set CLIENT_DIST=C:\Users\Nerd\OneDrive\Desktop\codes\softwares\office-connect-app\office-connect-client\dist
set SERVER_UPDATES=C:\OfficeConnectRelease

echo.
echo 🗑️ Cleaning old update files in %SERVER_UPDATES%...
if exist "%SERVER_UPDATES%\latest.yml" del /Q "%SERVER_UPDATES%\latest.yml"
if exist "%SERVER_UPDATES%\Office Connect Setup *.exe" del /Q "%SERVER_UPDATES%\Office Connect Setup *.exe"
if exist "%SERVER_UPDATES%\*.blockmap" del /Q "%SERVER_UPDATES%\*.blockmap"

echo.
echo 📦 Copying new Office Connect update files...
echo From: %CLIENT_DIST%
echo To:   %SERVER_UPDATES%
echo.

if not exist "%CLIENT_DIST%" (
  echo ❌ Client dist folder not found!
  pause
  exit /b 1
)

if not exist "%SERVER_UPDATES%" (
  echo ❌ Server update folder not found!
  pause
  exit /b 1
)

copy /Y "%CLIENT_DIST%\latest.yml" "%SERVER_UPDATES%\" 
copy /Y "%CLIENT_DIST%\Office Connect Setup *.exe" "%SERVER_UPDATES%\" 
copy /Y "%CLIENT_DIST%\*.blockmap" "%SERVER_UPDATES%\" 

echo.
echo ✅ Update pushed successfully.
echo Clients will auto-update on next check.
echo.
pause
